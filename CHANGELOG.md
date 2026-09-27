# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/)
(`MAJOR.MINOR.PATCH`).

## Convenção de commits

As mensagens de commit seguem [Conventional Commits](https://www.conventionalcommits.org/pt-br/1.0.0/):

| Tipo       | Uso                                              | Efeito na versão |
|------------|---------------------------------------------------|-------------------|
| `feat`     | nova funcionalidade                                | bump **MINOR**    |
| `fix`      | correção de bug                                    | bump **PATCH**    |
| `docs`     | documentação                                       | —                 |
| `style`    | formatação, sem mudança de lógica                  | —                 |
| `refactor` | refatoração sem mudança de comportamento           | —                 |
| `perf`     | melhoria de performance                            | bump **PATCH**    |
| `test`     | testes                                             | —                 |
| `chore`    | manutenção, configuração, tarefas de build         | —                 |
| `ci`       | integração contínua                                | —                 |

Mudanças que quebram compatibilidade (bump **MAJOR**) são marcadas com `!`
após o tipo (ex.: `feat!:`) ou com o rodapé `BREAKING CHANGE:` no corpo do
commit.

Releases são criadas a partir da branch `develop`, mergeadas em `main` com
merge commit (`--no-ff`) e marcadas com uma tag anotada `vMAJOR.MINOR.PATCH`.

## [1.0.0] - 2026-09-27

### Added
- Estrutura inicial do projeto Instituto Semear (SPA em JavaScript vanilla):
  páginas Início, Projetos e Cadastro, roteador por hash, formulário de
  cadastro de voluntários com máscaras/validação e modal de termos de uso.
  (commit `chore: versão base do projeto Instituto Semear`)
- Versionamento do projeto com Git seguindo o modelo GitFlow
  (`main` / `develop` / `feature/*` / `hotfix/*`).

[1.0.0]: https://github.com/jdnvaldivino/jdnva-front1/releases/tag/v1.0.0
