import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// Projeto de páginas múltiplas (sem framework): cada .html em html/ é um
// entry point independente, referenciando css/js por caminho relativo
// (../css, ../js) — por isso root fica em html/ e o build sai um nível
// acima, em dist/, preservando essa mesma estrutura de pastas.
export default defineConfig({
  root: 'html',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./html/index.html', import.meta.url)),
        projetos: fileURLToPath(new URL('./html/projetos.html', import.meta.url)),
        cadastro: fileURLToPath(new URL('./html/cadastro.html', import.meta.url)),
      },
    },
  },
});
