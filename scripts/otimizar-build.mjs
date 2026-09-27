// Passo de build complementar ao `vite build` (rodado logo depois, ver
// package.json "build"). O Vite já minifica e faz hash do CSS (via <link>)
// e do HTML dos 3 entry points, mas dois pontos ficam de fora do grafo dele
// nesta arquitetura específica:
//
// 1. JS clássico: o Vite (via Rollup) só inclui no grafo de módulos os
//    <script> marcados type="module". Este projeto usa
//    <script src="../js/x.js"> clássicos, sem type="module" de propósito —
//    várias funções (templateInicio, ROTAS, iniciarFormularioCadastro,
//    iniciarModalTermos...) são globais de escopo de script, lidas
//    implicitamente por outros arquivos carregados depois (é assim que
//    router.js "enxerga" templateInicio() sem import nenhum). Converter tudo
//    para módulos ES exigiria reescrever esse acoplamento (expor cada função
//    em window.*), um refator maior que foge do escopo desta tarefa (só
//    otimizar o build de produção). Por isso o JS é minificado à parte, por
//    arquivo, sem bundlar/concatenar nada — preserva a mesma contagem de
//    arquivos, mesmos nomes e mesma ordem de carregamento.
//
//    esbuild em modo "transform" (bundle:false) não bundla nem enxerga o
//    grafo entre arquivos, então não pode saber que um nome top-level (ex.:
//    templateInicio) é lido por outro arquivo — por segurança ele nunca
//    renomeia identificadores de escopo global nesse modo, só minifica
//    espaços, comentários e nomes de variáveis/parâmetros LOCAIS (dentro de
//    funções). Testado manualmente antes de adotar (ver
//    jdtasks/task-1207/resposta-otimizacao-producao.md).
//
// 2. HTML: o Vite reescreve o href do CSS para o arquivo com hash, mas não
//    remove comentários/espaços do próprio HTML. Isso é feito aqui com
//    html-minifier-terser.
//
// Também ajusta, no dist já achatado (html/css/js/imagens como pastas
// irmãs, em vez de html/ referenciando ../css e ../js um nível acima como
// no código-fonte), os caminhos relativos que sobrevivem como texto puro
// (atributo src do <script>, e a única referência de imagem dentro de um
// template JS) e copia a pasta imagens/ (sem otimização de imagem — fora do
// escopo desta etapa, já registrado como possível melhoria futura).

import { readdir, readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises';
import { transform } from 'esbuild';
import { minify as minifyHtml } from 'html-minifier-terser';
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Larguras do srcset responsivo: 400 cobre celular a 1x, 800 cobre
// celular a 2x (ou tablet a 1x), 1200 é a resolução nativa do arquivo
// original (para desktop a 2x) — gerar acima disso seria fazer upscale.
const LARGURAS_WEBP = [400, 800, 1200];
const LARGURA_FALLBACK_PNG = 600; // mesmo tamanho do <img width> hoje (fallback p/ navegador sem WebP)

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(raiz, 'dist');

async function minificarJs() {
  const origem = path.join(raiz, 'js');
  const destino = path.join(distDir, 'js');
  await mkdir(destino, { recursive: true });
  const arquivos = (await readdir(origem)).filter((nome) => nome.endsWith('.js'));
  const relatorio = [];

  for (const nome of arquivos) {
    const codigoOriginal = await readFile(path.join(origem, nome), 'utf8');
    const { code } = await transform(codigoOriginal, { minify: true, target: 'es2018', loader: 'js' });

    // Único caminho relativo "../" que sobrevive dentro do JS (a imagem de
    // capa referenciada por templates.js): no dist achatado vira "./imagens".
    const codigoAjustado = code.replace(/\.\.\/imagens\//g, './imagens/');

    await writeFile(path.join(destino, nome), codigoAjustado);
    relatorio.push({
      nome,
      tamanhoOriginal: Buffer.byteLength(codigoOriginal, 'utf8'),
      tamanhoFinal: Buffer.byteLength(codigoAjustado, 'utf8'),
    });
  }
  return relatorio;
}

async function otimizarImagens() {
  const origem = path.join(raiz, 'imagens');
  const destino = path.join(distDir, 'imagens');
  await mkdir(destino, { recursive: true });
  const relatorio = [];

  for (const nome of await readdir(origem)) {
    const caminhoOrigem = path.join(origem, nome);
    const extensao = path.extname(nome).toLowerCase();
    const semExtensao = path.basename(nome, extensao);

    if (extensao !== '.png' && extensao !== '.jpg' && extensao !== '.jpeg') {
      // SVG e outros formatos vetoriais/já otimizados: copia sem alterar.
      await copyFile(caminhoOrigem, path.join(destino, nome));
      continue;
    }

    const tamanhoOriginal = (await stat(caminhoOrigem)).size;

    // srcset responsivo em WebP — o <picture> em templates.js escolhe a
    // largura certa para a viewport/densidade de tela em vez de sempre
    // baixar a imagem inteira.
    for (const largura of LARGURAS_WEBP) {
      const buffer = await sharp(caminhoOrigem).resize({ width: largura }).webp({ quality: 80 }).toBuffer();
      const nomeSaida = `${semExtensao}-${largura}.webp`;
      await writeFile(path.join(destino, nomeSaida), buffer);
      relatorio.push({ nome: nomeSaida, tamanhoOriginal, tamanhoFinal: buffer.length });
    }

    // Fallback para navegadores sem suporte a WebP: PNG redimensionado e
    // recomprimido (não a imagem original em resolução 2x sem necessidade).
    const pngFallback = await sharp(caminhoOrigem)
      .resize({ width: LARGURA_FALLBACK_PNG })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();
    const nomeFallback = `${semExtensao}-${LARGURA_FALLBACK_PNG}.png`;
    await writeFile(path.join(destino, nomeFallback), pngFallback);
    relatorio.push({ nome: nomeFallback, tamanhoOriginal, tamanhoFinal: pngFallback.length });
  }
  return relatorio;
}

async function minificarHtml() {
  const arquivos = (await readdir(distDir)).filter((nome) => nome.endsWith('.html'));
  const relatorio = [];

  for (const nome of arquivos) {
    const caminho = path.join(distDir, nome);
    const htmlDoVite = await readFile(caminho, 'utf8');
    // "../js/x.js" -> "./js/x.js": no source, html/*.html referencia js/ um
    // nível acima; no dist achatado na raiz, js/ vira pasta irmã.
    const comCaminhosAjustados = htmlDoVite.replace(/\.\.\/js\//g, './js/');

    const minificado = await minifyHtml(comCaminhosAjustados, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
      minifyJS: false, // o JS de <script src> é minificado à parte, acima
    });

    await writeFile(caminho, minificado);
    relatorio.push({
      nome,
      tamanhoOriginal: Buffer.byteLength(htmlDoVite, 'utf8'),
      tamanhoFinal: Buffer.byteLength(minificado, 'utf8'),
    });
  }
  return relatorio;
}

function logRelatorio(titulo, relatorio) {
  console.log(`\n${titulo}`);
  let totalOriginal = 0;
  let totalFinal = 0;
  for (const r of relatorio) {
    const reducao = (100 * (1 - r.tamanhoFinal / r.tamanhoOriginal)).toFixed(1);
    console.log(`  ${r.nome}: ${r.tamanhoOriginal} B -> ${r.tamanhoFinal} B (-${reducao}%)`);
    totalOriginal += r.tamanhoOriginal;
    totalFinal += r.tamanhoFinal;
  }
  const reducaoTotal = (100 * (1 - totalFinal / totalOriginal)).toFixed(1);
  console.log(`  TOTAL: ${totalOriginal} B -> ${totalFinal} B (-${reducaoTotal}%)`);
}

const relatorioJs = await minificarJs();
const relatorioImagens = await otimizarImagens();
const relatorioHtml = await minificarHtml(); // roda depois do ajuste de ../js/ e da cópia de imagens

logRelatorio('Minificação de JS (esbuild, arquivo a arquivo, sem bundlar):', relatorioJs);
logRelatorio('Minificação de HTML (html-minifier-terser):', relatorioHtml);

console.log('\nOtimização de imagens (sharp: WebP responsivo + fallback PNG):');
for (const r of relatorioImagens) {
  const reducao = (100 * (1 - r.tamanhoFinal / r.tamanhoOriginal)).toFixed(1);
  console.log(`  ${r.nome}: original ${r.tamanhoOriginal} B -> ${r.tamanhoFinal} B (-${reducao}%)`);
}
