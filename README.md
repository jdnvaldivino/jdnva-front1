# Instituto Semear

Site institucional (SPA) da ONG fictícia Instituto Semear, desenvolvido em
HTML, CSS e JavaScript vanilla como projeto do curso de Ciência da Computação
(Cruzeiro do Sul). Apresenta a instituição, os projetos sociais em andamento
e um formulário de cadastro de voluntários com máscaras e validação.

## Tecnologias utilizadas

- **HTML5** semântico (landmarks, `aria-*`, formulários acessíveis)
- **CSS3** (grid próprio de 12 colunas, sem framework)
- **JavaScript** vanilla (ES5/ES6, sem framework nem bundler)
  - [`IMask.js`](https://unpkg.com/imask@7.6.1/dist/imask.min.js) via CDN, para máscaras de CPF/telefone/CEP
  - Roteamento client-side por hash (`js/router.js`), implementado do zero
  - `localStorage` para persistência do cadastro (`js/armazenamento.js`)
- **Git/GitHub**: GitFlow, Conventional Commits, SemVer, issues/milestones/PRs

## Pré-requisitos

- Um navegador moderno (Chrome, Firefox, Edge ou Safari atualizados).
- Não há dependências de Node/npm nem qualquer outro gerenciador de pacotes:
  o projeto não usa build step, transpilação ou bundling.
- Para servir os arquivos localmente (evitar restrições de `file://` em
  requisições do `IMask.js` e do roteador), qualquer servidor estático já
  disponível no sistema é suficiente — não é preciso instalar nada novo:
  - `python3 -m http.server 8000` (Python já vem no macOS/Linux), ou
  - `npx serve .` (usa o npm já existente na máquina, sem instalar o pacote
    permanentemente).

## Instalação e execução local

```bash
git clone https://github.com/jdnvaldivino/jdnva-front1.git
cd jdnva-front1
python3 -m http.server 8000
```

Depois, acessar `http://localhost:8000/html/index.html` no navegador. Não há
passo de instalação de dependências: o clone do repositório já deixa o
projeto pronto para uso.

## Build para produção

Ainda não existe uma etapa de build. A otimização dos arquivos para produção
(minificação de CSS/JS, compressão de imagens) é o escopo da issue
[#3](https://github.com/jdnvaldivino/jdnva-front1/issues/3) e será documentada
aqui quando implementada.

## Testes

O projeto não tem suíte de testes automatizados. A validação hoje é manual:
preenchimento do formulário de cadastro (`html/cadastro.html`) cobrindo os
campos obrigatórios, máscaras (CPF, telefone, CEP) e o fluxo do modal de
termos, além de checagem visual da navegação entre as três rotas da SPA.

## Estrutura do projeto

```
├── css/
│   └── style.css          # estilos globais, grid e componentes
├── js/
│   ├── router.js           # roteador da SPA (hash routing)
│   ├── templates.js         # templates HTML das rotas (Início/Projetos/Cadastro)
│   ├── navegacao.js         # menu hambúrguer e navegação
│   ├── modal.js              # modal de termos de uso
│   ├── mascaras-validacao.js # máscaras (CPF, telefone, CEP) e validação do formulário
│   └── armazenamento.js      # persistência local do cadastro
├── html/
│   ├── index.html            # ponto de entrada da SPA
│   ├── projetos.html          # versão estática da página de projetos
│   └── cadastro.html           # versão estática do formulário de cadastro
└── imagens/
```

`index.html` funciona como SPA: o roteador (`js/router.js`) intercepta
navegação e renderiza os templates de `js/templates.js` dentro de `<main
id="app">`, sincronizando a rota com o hash da URL (`#/`, `#/projetos`,
`#/cadastro`).

## Versionamento

O projeto segue o modelo **GitFlow** (`main` / `develop` / `feature/*` /
`hotfix/*`) e a convenção **Conventional Commits** com **Versionamento
Semântico** (`MAJOR.MINOR.PATCH`). Tipos de commit, regra de bump de versão e
histórico de releases estão em [CHANGELOG.md](./CHANGELOG.md).

## Gestão do trabalho

Issues e milestones no GitHub organizam as frentes do módulo 4 (versionamento,
acessibilidade, otimização para produção e documentação). Mudanças chegam a
`develop` via pull request, mesmo em desenvolvimento individual, para manter
o histórico descritivo do motivo e da forma de cada implementação.
