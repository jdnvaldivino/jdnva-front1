// Templates JavaScript: cada função devolve o HTML de uma "rota" da SPA,
// injetado dentro de <main id="app"> pelo roteador (router.js)
//
// Elementos repetitivos (cards de projeto, formas de doação, números de
// impacto) não ficam com marcação fixa copiada 3-4 vezes: os dados vivem em
// arrays de objetos e o HTML de cada item é gerado por .map(), evitando
// duplicação e permitindo alimentar a interface a partir de uma única fonte
// de dados (hoje um array local; poderia vir de uma API ou do localStorage
// sem mudar a função de renderização).

var NUMEROS_IMPACTO = [
  { valor: '3.400+', legenda: 'pessoas atendidas em 2025' },
  { valor: '18', legenda: 'projetos sociais ativos' },
  { valor: '560', legenda: 'voluntários cadastrados' }
];

var PROJETOS = [
  {
    id: 'projeto-1-title',
    tag: 'Educação',
    tagClasse: 'badge--primary',
    titulo: 'Semear Educação Digital',
    descricao: 'Aulas gratuitas de informática básica e lógica de programação para jovens de 14 a 18 anos, com certificação ao final do curso.'
  },
  {
    id: 'projeto-2-title',
    tag: 'Geração de renda',
    tagClasse: 'badge--secondary',
    titulo: 'Mãos que Produzem',
    descricao: 'Oficinas de costura e artesanato para mães chefes de família, com apoio para venda da produção em feiras locais.'
  },
  {
    id: 'projeto-3-title',
    tag: 'Assistência social',
    tagClasse: 'badge--primary',
    titulo: 'Semear Cidadania',
    descricao: 'Orientação jurídica e emissão de documentos civis para famílias em situação de vulnerabilidade.'
  },
  {
    id: 'projeto-4-title',
    tag: 'Meio ambiente',
    tagClasse: 'badge--neutral',
    titulo: 'Horta Comunitária Semear',
    descricao: 'Hortas coletivas em terrenos cedidos por parceiros, garantindo segurança alimentar e renda extra para as famílias participantes.'
  }
];

var FORMAS_DOACAO = [
  {
    id: 'doacao-pix-title',
    titulo: 'Pix',
    descricao: 'Chave CNPJ 00.000.000/0001-00, com recibo enviado automaticamente por e-mail.'
  },
  {
    id: 'doacao-transferencia-title',
    titulo: 'Transferência bancária',
    descricao: 'Banco 000, agência 0000, conta corrente 00000-0, em nome do Instituto Semear.'
  },
  {
    id: 'doacao-itens-title',
    titulo: 'Doação de itens',
    descricao: 'Recebemos alimentos não perecíveis, roupas e materiais escolares na sede da ONG.'
  }
];

function templateNumeroImpacto(numero) {
  return `
    <li class="col-sm-6 col-md-4">
      <strong>${numero.valor}</strong>
      <span>${numero.legenda}</span>
    </li>
  `;
}

function templateProjetoCard(projeto) {
  return `
    <article class="projeto col-sm-6 col-lg-3" aria-labelledby="${projeto.id}">
      <span class="badge ${projeto.tagClasse} projeto__tag">${projeto.tag}</span>
      <h3 id="${projeto.id}">${projeto.titulo}</h3>
      <p>${projeto.descricao}</p>
    </article>
  `;
}

function templateDoacaoCard(forma) {
  return `
    <article class="col-sm-6 col-md-4" aria-labelledby="${forma.id}">
      <h3 id="${forma.id}">${forma.titulo}</h3>
      <p>${forma.descricao}</p>
    </article>
  `;
}

function templateInicio() {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="container">
        <h1 id="hero-title">Plantando oportunidades, colhendo futuro</h1>
        <p>
          O Instituto Semear atua há 12 anos levando educação, capacitação profissional e apoio
          social a comunidades em situação de vulnerabilidade em todo o estado.
        </p>
        <a href="#/cadastro" data-rota class="btn">Quero ser voluntário</a>
      </div>
    </section>

    <section class="sobre" aria-labelledby="sobre-title">
      <div class="container">
        <h2 id="sobre-title">Quem somos</h2>

        <figure class="sobre__figura">
          <img src="../imagens/equipe-voluntarios.png" width="600" height="360"
            alt="Ilustração de três grupos de voluntários do Instituto Semear lado a lado, representando as diferentes frentes de atuação da ONG.">
          <figcaption>Parte da rede de voluntários que sustenta os projetos do Instituto Semear.</figcaption>
        </figure>

        <p>
          Somos uma organização sem fins lucrativos que acredita que educação e oportunidade
          transformam realidades. Trabalhamos junto a famílias, escolas públicas e empresas
          parceiras para ampliar o acesso a direitos básicos.
        </p>

        <div class="cards grid-12">
          <article class="col-sm-6 col-md-4">
            <h3>Missão</h3>
            <p>Promover educação, geração de renda e cidadania para pessoas em vulnerabilidade social.</p>
          </article>
          <article class="col-sm-6 col-md-4">
            <h3>Visão</h3>
            <p>Ser referência regional em impacto social mensurável até 2030.</p>
          </article>
          <article class="col-sm-6 col-md-4">
            <h3>Valores</h3>
            <p>Transparência, respeito à diversidade, colaboração e compromisso com resultados.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="numeros" aria-labelledby="numeros-title">
      <div class="container">
        <h2 id="numeros-title">Nosso impacto em números</h2>
        <ul class="stats grid-12">
          ${NUMEROS_IMPACTO.map(templateNumeroImpacto).join('')}
        </ul>
      </div>
    </section>

    <section class="cta" aria-labelledby="cta-title">
      <div class="container">
        <h2 id="cta-title">Faça parte dessa transformação</h2>
        <p>Conheça nossas iniciativas solidárias em andamento ou cadastre-se para colaborar com seu tempo e talento.</p>
        <div class="cta__actions">
          <a href="#/projetos" data-rota class="btn btn--outline">Ver projetos</a>
          <a href="#/cadastro" data-rota class="btn">Cadastre-se</a>
        </div>
      </div>
    </section>
  `;
}

function templateProjetos() {
  return `
    <section class="hero" aria-labelledby="projetos-title">
      <div class="container">
        <h1 id="projetos-title">Nossas iniciativas solidárias</h1>
        <p>Cada projeto nasce de uma necessidade real identificada junto às comunidades atendidas.</p>
      </div>
    </section>

    <section aria-labelledby="lista-projetos-title">
      <div class="container">
        <h2 id="lista-projetos-title">Projetos em andamento</h2>

        <div class="lista-projetos grid-12">
          ${PROJETOS.map(templateProjetoCard).join('')}
        </div>
      </div>
    </section>

    <section aria-labelledby="voluntariado-title">
      <div class="container">
        <h2 id="voluntariado-title">Como ser voluntário</h2>
        <p>
          Você pode colaborar diretamente com o tempo e o talento, participando de uma ou mais
          frentes de atuação da ONG. O processo tem três passos simples:
        </p>
        <ol class="passos-voluntariado">
          <li><strong>Cadastro:</strong> preencha o formulário de voluntariado com seus dados e disponibilidade.</li>
          <li><strong>Entrevista:</strong> nossa equipe entra em contato para entender seu interesse e experiência.</li>
          <li><strong>Integração:</strong> você é apresentado ao projeto mais alinhado ao seu perfil e começa a colaborar.</li>
        </ol>
        <a href="#/cadastro" data-rota class="btn">Quero ser voluntário</a>
      </div>
    </section>

    <section class="sobre" aria-labelledby="doacao-title">
      <div class="container">
        <h2 id="doacao-title">Como fazer sua doação</h2>
        <p>
          Doações financeiras sustentam a estrutura dos projetos e permitem ampliar o número de
          famílias atendidas. Confira as formas disponíveis de contribuir:
        </p>
        <div class="cards grid-12">
          ${FORMAS_DOACAO.map(templateDoacaoCard).join('')}
        </div>
      </div>
    </section>

    <section class="cta" aria-labelledby="cta-projetos-title">
      <div class="container">
        <h2 id="cta-projetos-title">Quer apoiar um desses projetos?</h2>
        <p>Cadastre-se como voluntário e escolha como contribuir com seu tempo e talento.</p>
        <a href="#/cadastro" data-rota class="btn">Cadastre-se agora</a>
      </div>
    </section>
  `;
}

function templateCadastro() {
  return `
    <section class="hero" aria-labelledby="cadastro-title">
      <div class="container">
        <h1 id="cadastro-title">Cadastro de voluntário</h1>
        <p>Preencha seus dados para fazer parte da nossa rede de colaboradores.</p>
      </div>
    </section>

    <section aria-labelledby="form-title">
      <div class="container">
        <h2 id="form-title" class="visualmente-oculto">Formulário de cadastro</h2>

        <form class="form-cadastro" id="form-cadastro" novalidate>
          <fieldset>
            <legend>Dados pessoais</legend>

            <div class="campo">
              <label for="nome">Nome completo *</label>
              <input type="text" id="nome" name="nome" required minlength="5" autocomplete="name"
                placeholder="Digite seu nome completo">
              <small class="erro" data-erro-para="nome"></small>
            </div>

            <div class="linha-dupla">
              <div class="campo">
                <label for="email">E-mail *</label>
                <input type="email" id="email" name="email" required autocomplete="email"
                  placeholder="seuemail@exemplo.com">
                <small class="erro" data-erro-para="email"></small>
              </div>

              <div class="campo">
                <label for="cpf">CPF *</label>
                <input type="text" id="cpf" name="cpf" required inputmode="numeric"
                  placeholder="000.000.000-00" maxlength="14" autocomplete="off"
                  pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" title="Formato esperado: 000.000.000-00">
                <small class="erro" data-erro-para="cpf"></small>
              </div>
            </div>

            <div class="linha-dupla">
              <div class="campo">
                <label for="telefone">Telefone / Celular *</label>
                <input type="tel" id="telefone" name="telefone" required inputmode="numeric"
                  placeholder="(00) 00000-0000" maxlength="15" autocomplete="tel"
                  pattern="\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}" title="Formato esperado: (00) 00000-0000">
                <small class="erro" data-erro-para="telefone"></small>
              </div>

              <div class="campo">
                <label for="nascimento">Data de nascimento *</label>
                <input type="date" id="nascimento" name="nascimento" required autocomplete="bday">
                <small class="erro" data-erro-para="nascimento"></small>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Endereço</legend>

            <div class="linha-dupla">
              <div class="campo">
                <label for="cep">CEP *</label>
                <input type="text" id="cep" name="cep" required inputmode="numeric"
                  placeholder="00000-000" maxlength="9" autocomplete="postal-code"
                  pattern="\\d{5}-\\d{3}" title="Formato esperado: 00000-000">
                <small class="erro" data-erro-para="cep"></small>
              </div>

              <div class="campo">
                <label for="cidade">Cidade *</label>
                <input type="text" id="cidade" name="cidade" required autocomplete="address-level2"
                  placeholder="Sua cidade">
                <small class="erro" data-erro-para="cidade"></small>
              </div>
            </div>

            <div class="campo">
              <label for="logradouro">Endereço *</label>
              <input type="text" id="logradouro" name="logradouro" required autocomplete="address-line1"
                placeholder="Rua, número, bairro">
              <small class="erro" data-erro-para="logradouro"></small>
            </div>
          </fieldset>

          <fieldset>
            <legend>Disponibilidade</legend>
            <div class="disponibilidade">
              <label><input type="checkbox" name="disponibilidade" value="manha"> Manhã</label>
              <label><input type="checkbox" name="disponibilidade" value="tarde"> Tarde</label>
              <label><input type="checkbox" name="disponibilidade" value="noite"> Noite</label>
              <label><input type="checkbox" name="disponibilidade" value="fimdesemana"> Fins de semana</label>
            </div>
          </fieldset>

          <div class="campo termos">
            <input type="checkbox" id="termos" name="termos" required>
            <label for="termos">Li e concordo com os termos de uso e a política de privacidade *</label>
          </div>
          <button type="button" class="link-botao" id="abrir-termos">Ver termos de uso e política de privacidade</button>
          <small class="erro" data-erro-para="termos"></small>

          <button type="submit" class="btn">Enviar cadastro</button>

          <p class="alert alert--success mensagem-sucesso" id="mensagem-sucesso" role="status">
            Cadastro enviado com sucesso! Em breve entraremos em contato.
          </p>
        </form>
      </div>
    </section>

    <div class="modal" id="modal-termos" hidden>
      <div class="modal__overlay" data-fechar-modal></div>
      <div class="modal__conteudo" role="dialog" aria-modal="true" aria-labelledby="modal-termos-title">
        <button type="button" class="modal__fechar" data-fechar-modal aria-label="Fechar">&times;</button>
        <h2 id="modal-termos-title">Termos de uso e política de privacidade</h2>
        <p>
          Ao se cadastrar como voluntário do Instituto Semear, você concorda que seus dados (nome,
          e-mail, CPF, telefone e endereço) serão usados exclusivamente para organizar sua alocação
          em projetos sociais e para contato da equipe de voluntariado, nunca compartilhados com
          terceiros sem a sua autorização.
        </p>
        <button type="button" class="btn" data-fechar-modal>Entendi</button>
      </div>
    </div>
  `;
}
