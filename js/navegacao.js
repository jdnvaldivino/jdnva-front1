// Menu de navegação: alterna o menu hambúrguer em telas estreitas

document.addEventListener('DOMContentLoaded', function () {
  var botao = document.getElementById('nav-toggle');
  var menu = document.getElementById('menu-principal');
  if (!botao || !menu) return;

  function fecharMenu() {
    menu.classList.remove('nav-principal--aberto');
    botao.setAttribute('aria-expanded', 'false');
  }

  botao.addEventListener('click', function () {
    var aberto = menu.classList.toggle('nav-principal--aberto');
    botao.setAttribute('aria-expanded', String(aberto));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 767px)').matches) {
        fecharMenu();
      }
    });
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      fecharMenu();
    }
  });

  // Fecha ao clicar fora do menu/botão: sem isso, abrir o hambúrguer e
  // depois clicar em qualquer conteúdo fora da lista de links (ex.: um CTA
  // dentro de <main>) deixava o menu aberto, sobrepondo a página.
  document.addEventListener('click', function (evento) {
    if (!menu.classList.contains('nav-principal--aberto')) return;
    if (menu.contains(evento.target) || botao.contains(evento.target)) return;
    fecharMenu();
  });
});
