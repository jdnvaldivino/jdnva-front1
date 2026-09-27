// Modal de termos de uso: abre/fecha, controla o foco e implementa o padrão
// WAI-ARIA de diálogo modal (foco preso dentro do modal enquanto aberto,
// foco devolvido ao botão que o abriu ao fechar).
//
// Função nomeada, chamada pelo roteador toda vez que a rota "cadastro" é
// renderizada (o <form> e o modal são recriados a cada troca de rota na SPA).

function iniciarModalTermos() {
  var abrir = document.getElementById('abrir-termos');
  var modal = document.getElementById('modal-termos');
  if (!abrir || !modal) return;

  function elementosFocaveis() {
    var seletor = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.prototype.filter.call(modal.querySelectorAll(seletor), function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
  }

  function aoTeclarNoModal(evento) {
    if (evento.key === 'Escape') {
      fecharModal();
      return;
    }
    if (evento.key !== 'Tab') return;

    var focaveis = elementosFocaveis();
    if (focaveis.length === 0) return;
    var primeiro = focaveis[0];
    var ultimo = focaveis[focaveis.length - 1];

    // Tab preso dentro do modal: do último campo volta ao primeiro, e
    // Shift+Tab do primeiro vai para o último, sem nunca sair para o
    // conteúdo por trás do overlay.
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  function abrirModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__fechar').focus();
    document.addEventListener('keydown', aoTeclarNoModal);
  }

  function fecharModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', aoTeclarNoModal);
    abrir.focus();
  }

  abrir.addEventListener('click', abrirModal);

  modal.querySelectorAll('[data-fechar-modal]').forEach(function (el) {
    el.addEventListener('click', fecharModal);
  });
}

if (document.getElementById('modal-termos')) {
  iniciarModalTermos();
}
