# Instituto Semear

Site institucional (SPA) da ONG fictícia Instituto Semear, desenvolvido em
HTML, CSS e JavaScript vanilla como projeto do curso de Ciência da Computação
(Cruzeiro do Sul).

## Como rodar localmente

Não há build nem dependências de instalação. Basta servir a pasta com um
servidor estático simples, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

E abrir `html/index.html` no navegador.

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
Semântico**. Detalhes, tipos de commit e histórico de releases em
[CHANGELOG.md](./CHANGELOG.md).

## Gestão do trabalho

Issues e milestones no GitHub organizam as frentes do módulo 4 (versionamento,
acessibilidade, otimização para produção e documentação). Mudanças chegam a
`develop` via pull request, mesmo em desenvolvimento individual, para manter
o histórico descritivo do motivo e da forma de cada implementação.
