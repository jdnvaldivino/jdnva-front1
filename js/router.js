// Roteador da SPA: intercepta a navegação, decide qual template renderizar
// dentro de <main id="app"> e mantém a URL (hash) sincronizada com a rota

var ROTAS = {
  '': { template: templateInicio, titulo: 'Instituto Semear | Início' },
  'projetos': { template: templateProjetos, titulo: 'Instituto Semear | Projetos' },
  'cadastro': { template: templateCadastro, titulo: 'Instituto Semear | Seja Voluntário' }
};

function lerRotaAtual() {
  var bruta = location.hash.replace(/^#\/?/, ''); // "#/projetos/doacao-title" -> "projetos/doacao-title"
  var partes = bruta.split('/').filter(Boolean);
  return { chave: partes[0] || '', ancora: partes[1] || null };
}

function executarHookDaRota(chave) {
  if (chave === 'cadastro') {
    if (typeof iniciarFormularioCadastro === 'function') iniciarFormularioCadastro();
    if (typeof iniciarModalTermos === 'function') iniciarModalTermos();
  }
}

function atualizarLinkAtivo(chave) {
  document.querySelectorAll('[data-rota]').forEach(function (link) {
    link.removeAttribute('aria-current');
  });
  var destinoEsperado = chave === '' ? '#/' : '#/' + chave;
  document.querySelectorAll('[data-rota]').forEach(function (link) {
    if (link.getAttribute('href') === destinoEsperado) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function renderizarRota() {
  var rota = lerRotaAtual();
  var definicao = ROTAS[rota.chave] || ROTAS[''];
  var app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = definicao.template();
  document.title = definicao.titulo;
  atualizarLinkAtivo(rota.chave);
  executarHookDaRota(rota.chave);

  if (rota.ancora) {
    var alvo = document.getElementById(rota.ancora);
    if (alvo) {
      alvo.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  }
  window.scrollTo(0, 0);
}

function interceptarNavegacao(evento) {
  var link = evento.target.closest('[data-rota]');
  if (!link) return;

  evento.preventDefault();
  var destino = link.getAttribute('href');

  if (location.hash === destino) {
    renderizarRota(); // já está na rota: força re-renderização (ex.: reabrir formulário limpo)
  } else {
    location.hash = destino; // dispara "hashchange", que chama renderizarRota()
  }
}

document.addEventListener('click', interceptarNavegacao);
window.addEventListener('hashchange', renderizarRota);
window.addEventListener('DOMContentLoaded', function () {
  if (!location.hash) {
    location.hash = '#/';
  } else {
    renderizarRota();
  }
});
