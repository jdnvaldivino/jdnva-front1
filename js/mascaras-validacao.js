// Máscaras de entrada e validações do formulário de cadastro de voluntário
//
// Exposta como função nomeada (em vez de rodar sozinha no DOMContentLoaded)
// porque na SPA o <form> só existe depois que o roteador injeta o template
// da rota "cadastro" em <main id="app">. O próprio router chama esta função
// logo após renderizar. Nas páginas HTML estáticas (fallback sem JS de rota),
// o form já existe quando o script é lido, então chamamos direto no final do arquivo.
//
// Máscaras: se a biblioteca externa IMask (carregada via <script> de CDN,
// ver <head>/fim do <body>) estiver disponível, ela assume CPF/telefone/CEP.
// Avaliamos a troca porque IMask cobre casos de borda (colar texto, mover o
// cursor no meio do valor, apagar com backspace) melhor que regex manual, sem
// dependências e com poucos KBs. O risco é rodar via file:// sem internet: o
// <script> da CDN pode não carregar, então window.IMask fica indefinido e o
// código cai automaticamente para as mesmas máscaras manuais que já existiam
// (feature detection, sem quebrar o fluxo).
//
// Persistência: os dados digitados são salvos a cada input ("rascunho") e
// restaurados se o usuário recarregar a página antes de enviar o formulário
// — evita perda de contexto. No envio bem-sucedido, o cadastro completo vai
// para uma lista separada e o rascunho é apagado. Este arquivo NÃO acessa
// localStorage diretamente: toda leitura/gravação passa pelas funções de
// js/armazenamento.js (carregado antes deste script), que é o único módulo
// que conhece o formato de Web Storage — separação por responsabilidade,
// para que a lógica de formulário/DOM não fique misturada com a de
// armazenamento no mesmo arquivo.

function iniciarFormularioCadastro() {
  var form = document.getElementById('form-cadastro');
  if (!form) return;

  var campoCpf = document.getElementById('cpf');
  var campoTelefone = document.getElementById('telefone');
  var campoCep = document.getElementById('cep');
  var mensagemSucesso = document.getElementById('mensagem-sucesso');

  function apenasDigitos(valor) {
    return valor.replace(/\D/g, '');
  }

  function mostrarErro(campo, texto) {
    var alvo = form.querySelector('[data-erro-para="' + campo.name + '"]');
    if (alvo) alvo.textContent = texto || '';
    campo.classList.toggle('campo--invalido', Boolean(texto));
    // aria-invalid avisa leitores de tela do estado do campo sem depender só
    // da cor da borda; o texto do erro já está ligado via aria-describedby
    // (declarado no HTML) e é anunciado pelo role="alert" do próprio <small>.
    campo.setAttribute('aria-invalid', Boolean(texto));
  }

  // --- Persistência em localStorage (rascunho + lista de cadastros) ---

  function lerFormularioComoObjeto() {
    var dados = { disponibilidade: [] };
    Array.prototype.forEach.call(form.elements, function (campo) {
      if (!campo.name) return;
      if (campo.type === 'checkbox') {
        if (campo.name === 'disponibilidade') {
          if (campo.checked) dados.disponibilidade.push(campo.value);
        } else {
          dados[campo.name] = campo.checked;
        }
      } else {
        dados[campo.name] = campo.value;
      }
    });
    return dados;
  }

  function salvarRascunho() {
    salvarRascunhoCadastro(lerFormularioComoObjeto());
  }

  function restaurarRascunho() {
    var dados = lerRascunhoCadastro();
    if (!dados) return;

    Array.prototype.forEach.call(form.elements, function (campo) {
      if (!campo.name || !(campo.name in dados)) return;
      if (campo.type === 'checkbox') {
        if (campo.name === 'disponibilidade') {
          campo.checked = dados.disponibilidade.indexOf(campo.value) !== -1;
        } else {
          campo.checked = Boolean(dados[campo.name]);
        }
      } else {
        campo.value = dados[campo.name];
      }
    });

    // Campos com máscara pela IMask têm estado interno próprio; depois de
    // atribuir o value "cru" acima, updateValue() força a biblioteca a reler
    // o input e reformatar (ex.: "12345678900" -> "123.456.789-00").
    if (instanciasIMask) {
      Object.keys(instanciasIMask).forEach(function (chave) {
        instanciasIMask[chave].updateValue();
      });
    }
  }

  // --- Máscaras de CPF / telefone / CEP ---
  // (precisa existir antes de restaurarRascunho(), que consulta instanciasIMask)

  var usarIMask = typeof IMask === 'function';
  var instanciasIMask = null;

  if (usarIMask) {
    instanciasIMask = {
      cpf: IMask(campoCpf, { mask: '000.000.000-00' }),
      telefone: IMask(campoTelefone, {
        mask: [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]
      }),
      cep: IMask(campoCep, { mask: '00000-000' })
    };
  } else {
    // Fallback manual: mesma lógica de sempre, usada quando a CDN da IMask
    // não pôde ser carregada (ex.: página aberta via file:// sem internet).

    // Máscara de CPF: 000.000.000-00
    campoCpf.addEventListener('input', function () {
      var digitos = apenasDigitos(campoCpf.value).slice(0, 11);
      var formatado = digitos
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      campoCpf.value = formatado;
    });

    // Máscara de telefone: (00) 0000-0000 ou (00) 00000-0000
    campoTelefone.addEventListener('input', function () {
      var digitos = apenasDigitos(campoTelefone.value).slice(0, 11);
      var formatado = digitos;
      if (digitos.length > 10) {
        formatado = digitos.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      } else if (digitos.length > 6) {
        formatado = digitos.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (digitos.length > 2) {
        formatado = digitos.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (digitos.length > 0) {
        formatado = digitos.replace(/(\d{0,2})/, '($1');
      }
      campoTelefone.value = formatado.replace(/-$/, '').replace(/\)\s*$/, ') ');
    });

    // Máscara de CEP: 00000-000
    campoCep.addEventListener('input', function () {
      var digitos = apenasDigitos(campoCep.value).slice(0, 8);
      campoCep.value = digitos.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    });
  }

  // Rascunho só é restaurado depois que as máscaras (IMask ou manuais) já
  // estão registradas, senão o valor restaurado fica sem formatação.
  restaurarRascunho();
  form.addEventListener('input', salvarRascunho);

  campoCpf.addEventListener('blur', function () {
    var digitos = apenasDigitos(campoCpf.value);
    if (digitos.length === 0) {
      mostrarErro(campoCpf, '');
      return;
    }
    if (!cpfValido(digitos)) {
      mostrarErro(campoCpf, 'CPF inválido. Confira os números digitados.');
    } else {
      mostrarErro(campoCpf, '');
    }
  });

  campoTelefone.addEventListener('blur', function () {
    var digitos = apenasDigitos(campoTelefone.value);
    if (digitos.length === 0) {
      mostrarErro(campoTelefone, '');
    } else if (digitos.length < 10) {
      mostrarErro(campoTelefone, 'Informe DDD + número completo.');
    } else {
      mostrarErro(campoTelefone, '');
    }
  });

  campoCep.addEventListener('blur', function () {
    var digitos = apenasDigitos(campoCep.value);
    if (digitos.length === 0) {
      mostrarErro(campoCep, '');
    } else if (digitos.length !== 8) {
      mostrarErro(campoCep, 'CEP deve ter 8 dígitos.');
    } else {
      mostrarErro(campoCep, '');
    }
  });

  // Algoritmo de validação dos dígitos verificadores do CPF
  function cpfValido(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    var soma = 0;
    for (var i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    var resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== parseInt(cpf.charAt(9), 10)) return false;

    soma = 0;
    for (var j = 0; j < 10; j++) {
      soma += parseInt(cpf.charAt(j), 10) * (11 - j);
    }
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === parseInt(cpf.charAt(10), 10);
  }

  // Validação nativa (Constraint Validation API) + mensagens customizadas
  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    mensagemSucesso.classList.remove('visivel');

    var digitosCpf = apenasDigitos(campoCpf.value);
    if (digitosCpf.length > 0 && !cpfValido(digitosCpf)) {
      campoCpf.setCustomValidity('CPF inválido.');
    } else {
      campoCpf.setCustomValidity('');
    }

    Array.prototype.forEach.call(form.elements, function (campo) {
      if (!campo.willValidate) return;
      // Sempre chama mostrarErro (com texto vazio quando válido) em vez de só
      // quando inválido: campos corrigidos sem novo "blur" — ex. usuário
      // aperta Enter, que envia o form sem tirar o foco do campo — ficavam
      // com a mensagem/halo de erro antigos, já obsoletos, presos na tela.
      mostrarErro(campo, campo.checkValidity() ? '' : campo.validationMessage);
    });

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var dadosCadastro = lerFormularioComoObjeto();
    dadosCadastro.enviadoEm = new Date().toISOString();
    salvarVoluntario(dadosCadastro);
    limparRascunhoCadastro();

    mensagemSucesso.classList.add('visivel');
    form.reset();

    if (instanciasIMask) {
      Object.keys(instanciasIMask).forEach(function (chave) {
        instanciasIMask[chave].updateValue();
      });
    }
  });
}

if (document.getElementById('form-cadastro')) {
  iniciarFormularioCadastro();
}
