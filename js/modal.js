// Modal de termos de uso: abre/fecha e controla o foco
//
// Função nomeada, chamada pelo roteador toda vez que a rota "cadastro" é
// renderizada (o <form> e o modal são recriados a cada troca de rota na SPA).
// O listener de Esc fica registrado uma única vez em document (guardado por
// uma flag), sempre consultando o modal atual em vez de uma referência antiga.

function iniciarModalTermos() {
  var abrir = document.getElementById('abrir-termos');
  var modal = document.getElementById('modal-termos');
  if (!abrir || !modal) return;

  function abrirModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__fechar').focus();
  }

  function fecharModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    abrir.focus();
  }

  abrir.addEventListener('click', abrirModal);

  modal.querySelectorAll('[data-fechar-modal]').forEach(function (el) {
    el.addEventListener('click', fecharModal);
  });

  if (!window.__modalTermosEscListenerAtivo) {
    window.__modalTermosEscListenerAtivo = true;
    document.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Escape') return;
      var modalAtual = document.getElementById('modal-termos');
      if (modalAtual && !modalAtual.hidden) {
        modalAtual.hidden = true;
        document.body.style.overflow = '';
      }
    });
  }
}

if (document.getElementById('modal-termos')) {
  iniciarModalTermos();
}
