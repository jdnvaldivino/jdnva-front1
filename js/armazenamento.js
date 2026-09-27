// Camada de persistência (Web Storage do navegador)
//
// Isolada de qualquer lógica de formulário, máscara ou manipulação de DOM:
// este arquivo só conhece chaves de localStorage e formatos de dados (via
// JSON.stringify/JSON.parse). Ele não sabe que existe um <form>, nem toca
// em elementos da página — quem precisa persistir algo chama uma destas
// funções em vez de mexer em localStorage diretamente, o que mantém o
// acoplamento baixo (mascaras-validacao.js não sabe o nome real das chaves)
// e a coesão alta (tudo relacionado a Web Storage mora num só lugar).

var CHAVE_RASCUNHO_CADASTRO = 'semear_cadastro_rascunho';
var CHAVE_VOLUNTARIOS_SALVOS = 'semear_voluntarios';

function salvarRascunhoCadastro(dados) {
  localStorage.setItem(CHAVE_RASCUNHO_CADASTRO, JSON.stringify(dados));
}

function lerRascunhoCadastro() {
  var bruto = localStorage.getItem(CHAVE_RASCUNHO_CADASTRO);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto);
  } catch (erro) {
    localStorage.removeItem(CHAVE_RASCUNHO_CADASTRO);
    return null;
  }
}

function limparRascunhoCadastro() {
  localStorage.removeItem(CHAVE_RASCUNHO_CADASTRO);
}

function salvarVoluntario(dados) {
  var lista;
  try {
    lista = JSON.parse(localStorage.getItem(CHAVE_VOLUNTARIOS_SALVOS)) || [];
  } catch (erro) {
    lista = [];
  }
  lista.push(dados);
  localStorage.setItem(CHAVE_VOLUNTARIOS_SALVOS, JSON.stringify(lista));
}
