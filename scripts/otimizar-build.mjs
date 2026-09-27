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

import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { minify as minifyHtml } from 'html-minifier-terser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

async function copiarImagens() {
  const origem = path.join(raiz, 'imagens');
  const destino = path.join(distDir, 'imagens');
  await mkdir(destino, { recursive: true });
  for (const nome of await readdir(origem)) {
    await copyFile(path.join(origem, nome), path.join(destino, nome));
  }
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
await copiarImagens();
const relatorioHtml = await minificarHtml(); // roda depois do ajuste de ../js/ e da cópia de imagens

logRelatorio('Minificação de JS (esbuild, arquivo a arquivo, sem bundlar):', relatorioJs);
logRelatorio('Minificação de HTML (html-minifier-terser):', relatorioHtml);
