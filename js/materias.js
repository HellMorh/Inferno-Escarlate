
/* ==========================================
   INFERNO ESCARLATE
   SISTEMA CENTRAL DE MATÉRIAS
========================================== */


/* ==========================================
   CATÁLOGO DE MATÉRIAS
========================================== */

const MATERIAS = [

  /* ==========================================
     SE EU FOSSE VOCÊ 3
     CINEMA NACIONAL / INFERNO MARFIM
  ========================================== */

  {
    titulo: "Se Eu Fosse Você 3 aposta na mesma fórmula e garante nostalgia",

    resumo: "Cleo Pires e Rafael Infante assumem o protagonismo da franquia e dão uma nova cara à comédia marcada por Glória Pires e Tony Ramos.",

    imagem: "imagem/se-eu-fosse-voce-3-capa.jpg",

    alt: "Filme Se Eu Fosse Você 3, com Cleo Pires e Rafael Infante",

    url: "posts/se-eu-fosse-voce-3.html",

    categorias: ["cinema"],

    categoriaTexto: "Cinema nacional • Coluna",

    data: "2026-10-10T15:00:00",

    destaque: false
  },

  /* ==========================================
     ROCK IN RIO 2026
     MÚSICA / EVENTOS / FESTIVAIS
  ========================================== */

  {
    titulo: "Faltou rock mais uma vez quando o assunto é Rock In Rio 2026?",

    resumo: "Foo Fighters, Rise Against, Detonautas, Capital Inicial e outros abrem uma edição que reacende o debate sobre o espaço do rock.",

    imagem: "imagem/rock-in-rio-foo-fighters.jpg",

    alt: "Foo Fighters no Rock in Rio 2026",

    url: "posts/materia-rock-in-rio-2026.html",

    categorias: ["musica", "eventos", "festivais"],

    categoriaTexto: "Música • Festivais",

    data: "2026-09-05T12:00:00",

    destaque: true
  },

  /* ==========================================
     UNIVERSAL PICTURES
     CINEMA / SÉRIES E TV
  ========================================== */

  {
    titulo: "Dona da Universal Pictures planeja separação em duas empresas",

    resumo: "A Comcast anunciou um plano de reestruturação envolvendo a NBCUniversal e a Sky.",

    imagem: "imagem/universal.jpg",

    alt: "Universal Pictures e mercado audiovisual",

    url: "posts/universal.html",

    categorias: ["cinema", "series"],

    categoriaTexto: "Cinema e televisão",

    data: "2026-06-27T12:00:00",

    destaque: false
  }

];


/* ==========================================
   CONFIGURAÇÕES GERAIS
========================================== */

const SITE_URL = "https://infernoescarlate.com/";

const CATEGORIAS_VALIDAS = [
  "cinema",
  "series",
  "games",
  "musica",
  "animes",
  "mangas",
  "eventos",
  "festivais",
  "doramas-novelas",
  "livros",
  "esports",
  "hqs"
];


/* ==========================================
   URLs ABSOLUTAS
========================================== */

function urlAbsoluta(caminho) {
  return new URL(caminho, SITE_URL).href;
}


/* ==========================================
   FORMATAÇÃO DAS DATAS
========================================== */

function dataFormatada(data) {

  const apenasData = data.split("T")[0];

  const partes = apenasData.split("-");

  if (partes.length !== 3) {
    return apenasData;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ==========================================
   ORDENAÇÃO DAS MATÉRIAS
   MAIS RECENTES PRIMEIRO
========================================== */

function ordenarMaterias(lista) {

  return [...lista].sort((a, b) => {

    return new Date(b.data) - new Date(a.data);

  });

}


/* ==========================================
   CAMINHOS RELATIVOS

   HOME:
   posts/materia.html

   CATEGORIA:
   ../posts/materia.html
========================================== */

function caminhoComPrefixo(prefixo, caminho) {

  return `${prefixo || ""}${caminho}`;

}


/* ==========================================
   VALIDAR CATEGORIAS CADASTRADAS
========================================== */

function validarCategorias() {

  MATERIAS.forEach((materia) => {

    materia.categorias.forEach((categoria) => {

      if (!CATEGORIAS_VALIDAS.includes(categoria)) {

        console.warn(
          "Inferno Escarlate: categoria não reconhecida:",
          categoria,
          "na matéria:",
          materia.titulo
        );

      }

    });

  });

}


/* ==========================================
   CRIAR CARD DE MATÉRIA

   UTILIZADO NA HOME,
   NA LISTAGEM GERAL
   E NAS CATEGORIAS
========================================== */

function criarCardMateria(materia, prefixo = "") {

  const categorias = materia.categorias.join(" ");

  const url = caminhoComPrefixo(
    prefixo,
    materia.url
  );

  const imagem = caminhoComPrefixo(
    prefixo,
    materia.imagem
  );

  const dataISO = materia.data.split("T")[0];

  return `
    <article
      class="card-materia"
      data-categoria="${categorias}"
      itemscope
      itemtype="https://schema.org/Article"
    >

      <meta
        itemprop="mainEntityOfPage"
        content="${urlAbsoluta(materia.url)}"
      >

      <a
        href="${url}"
        class="link-imagem-materia"
        aria-label="Ler: ${materia.titulo}"
        itemprop="url"
      >

        <img
          src="${imagem}"
          alt="${materia.alt}"
          loading="lazy"
          decoding="async"
          itemprop="image"
        >

      </a>

      <div class="card-conteudo">

        <span class="categoria">
          ${materia.categoriaTexto}
        </span>

        <h3 itemprop="headline">

          <a
            href="${url}"
            class="link-titulo-materia"
          >
            ${materia.titulo}
          </a>

        </h3>

        <p itemprop="description">
          ${materia.resumo}
        </p>

        <time
          datetime="${dataISO}"
          itemprop="datePublished"
          style="display:none"
        >
          ${dataFormatada(materia.data)}
        </time>

        <a
          href="${url}"
          class="link-ler-materia"
        >
          Ler matéria
        </a>

      </div>

    </article>
  `;

}


/* ==========================================
   RENDERIZAR LISTA DE MATÉRIAS
========================================== */

function renderizarLista(
  container,
  lista,
  prefixo = ""
) {

  if (!container) return;

  container.innerHTML = lista
    .map((materia) => {

      return criarCardMateria(
        materia,
        prefixo
      );

    })
    .join("");

}


/* ==========================================
   MENSAGEM PARA CATEGORIAS VAZIAS

   A MENSAGEM É CRIADA APENAS
   QUANDO NÃO HOUVER PUBLICAÇÕES.
========================================== */

function mostrarCategoriaVazia(container) {

  if (!container) return;

  const avisoAnterior = container.parentElement
    .querySelector(".categoria-vazia[data-aviso-automatico]");

  if (avisoAnterior) {
    avisoAnterior.remove();
  }

  const aviso = document.createElement("div");

  aviso.className = "categoria-vazia";

  aviso.dataset.avisoAutomatico = "true";

  aviso.innerHTML = `
    <h3>Novas matérias em breve</h3>

    <p>
      Estamos preparando novos conteúdos
      para esta categoria. Enquanto isso,
      explore as outras publicações
      do Inferno Escarlate.
    </p>
  `;

  container.insertAdjacentElement(
    "afterend",
    aviso
  );

}


/* ==========================================
   DESTAQUE PRINCIPAL DA HOME
========================================== */

function renderizarDestaquePrincipal() {

  const container = document.querySelector(
    "#destaque-principal"
  );

  if (!container) return;

  const materiasOrdenadas = ordenarMaterias(
    MATERIAS
  );

  const materia =
    materiasOrdenadas.find((item) => {
      return item.destaque === true;
    }) || materiasOrdenadas[0];

  if (!materia) return;

  container.innerHTML = `
    <div class="destaque-imagem">

      <a
        href="${materia.url}"
        aria-label="Ler: ${materia.titulo}"
      >

        <img
          src="${materia.imagem}"
          alt="${materia.alt}"
          fetchpriority="high"
        >

      </a>

    </div>

    <div class="destaque-conteudo">

      <span class="categoria">
        ${materia.categoriaTexto}
      </span>

      <h2>

        <a
          href="${materia.url}"
          class="link-titulo-materia"
        >
          ${materia.titulo}
        </a>

      </h2>

      <p>
        ${materia.resumo}
      </p>

      <a
        href="${materia.url}"
        class="botao"
      >
        Ler matéria
      </a>

    </div>
  `;

}


/* ==========================================
   ÚLTIMAS MATÉRIAS DA HOME
========================================== */

function renderizarUltimasMaterias() {

  const container = document.querySelector(
    "#ultimas-materias"
  );

  if (!container) return;

  const ultimas = ordenarMaterias(
    MATERIAS
  ).slice(0, 3);

  renderizarLista(
    container,
    ultimas
  );

}


/* ==========================================
   PÁGINA GERAL DE MATÉRIAS
========================================== */

function renderizarTodasMaterias() {

  const container = document.querySelector(
    "#todas-materias"
  );

  if (!container) return;

  renderizarLista(
    container,
    ordenarMaterias(MATERIAS)
  );

  ativarFiltros();

}


/* ==========================================
   PÁGINAS DE CATEGORIAS

   EXEMPLO:
   <body data-categoria-pagina="cinema">

   <div id="categoria-materias"></div>
========================================== */

function renderizarPaginaCategoria() {

  const container = document.querySelector(
    "#categoria-materias"
  );

  if (!container) return;

  const categoria =
    document.body.dataset.categoriaPagina;

  if (!categoria) return;

  const lista = ordenarMaterias(MATERIAS)
    .filter((materia) => {

      return materia.categorias.includes(
        categoria
      );

    });

  renderizarLista(
    container,
    lista,
    "../"
  );

  if (lista.length === 0) {

    mostrarCategoriaVazia(container);

  } else {

    const avisoAnterior = container.parentElement
      .querySelector(
        ".categoria-vazia[data-aviso-automatico]"
      );

    if (avisoAnterior) {
      avisoAnterior.remove();
    }

  }

}


/* ==========================================
   FILTROS DA PÁGINA DE MATÉRIAS
========================================== */

function ativarFiltros() {

  const botoes = document.querySelectorAll(
    ".filtros-materias [data-filtro]"
  );

  const container = document.querySelector(
    "#todas-materias"
  );

  if (!container || !botoes.length) return;

  const cards = [
    ...container.querySelectorAll(
      "[data-categoria]"
    )
  ];

  const aviso = document.querySelector(
    "#sem-materias"
  );

  function aplicarFiltro(filtro) {

    let quantidadeVisivel = 0;

    cards.forEach((card) => {

      const categorias = card.dataset.categoria
        .trim()
        .split(/\s+/);

      const mostrar =
        filtro === "todas" ||
        categorias.includes(filtro);

      card.style.display = mostrar ? "" : "none";

      if (mostrar) {
        quantidadeVisivel++;
      }

    });

    botoes.forEach((botao) => {

      const ativo =
        botao.dataset.filtro === filtro;

      botao.classList.toggle(
        "ativo",
        ativo
      );

      botao.setAttribute(
        "aria-pressed",
        String(ativo)
      );

    });

    if (aviso) {

      aviso.classList.toggle(
        "visivel",
        quantidadeVisivel === 0
      );

    }

  }

  botoes.forEach((botao) => {

    botao.addEventListener(
      "click",
      () => {

        aplicarFiltro(
          botao.dataset.filtro
        );

      }
    );

  });

  const filtroInicial =
    document.querySelector(
      ".filtros-materias .ativo"
    )?.dataset.filtro || "todas";

  aplicarFiltro(filtroInicial);

}


/* ==========================================
   DADOS ESTRUTURADOS
   LISTAGEM DE MATÉRIAS

   AJUDA MECANISMOS DE BUSCA
   A IDENTIFICAR PUBLICAÇÕES
   PRESENTES NAS LISTAGENS.
========================================== */

function adicionarDadosEstruturados() {

  const paginaInicial =
    document.querySelector(
      "#ultimas-materias"
    ) !== null;

  const paginaMaterias =
    document.querySelector(
      "#todas-materias"
    ) !== null;

  const paginaCategoria =
    document.querySelector(
      "#categoria-materias"
    ) !== null;

  if (
    !paginaInicial &&
    !paginaMaterias &&
    !paginaCategoria
  ) {
    return;
  }

  let lista = ordenarMaterias(
    MATERIAS
  );

  if (paginaInicial) {

    lista = lista.slice(0, 3);

  }

  if (paginaCategoria) {

    const categoria =
      document.body.dataset.categoriaPagina;

    lista = lista.filter((materia) => {

      return materia.categorias.includes(
        categoria
      );

    });

  }

  // Evita criar uma lista vazia.
  if (lista.length === 0) return;

  // Evita duplicar o script se a função
  // for executada novamente.
  const scriptAnterior = document.querySelector(
    'script[data-schema-materias="true"]'
  );

  if (scriptAnterior) {
    scriptAnterior.remove();
  }

  const dados = {

    "@context": "https://schema.org",

    "@type": "ItemList",

    "name": paginaCategoria
      ? "Matérias por categoria do Inferno Escarlate"
      : paginaMaterias
        ? "Todas as matérias do Inferno Escarlate"
        : "Últimas matérias do Inferno Escarlate",

    "itemListElement": lista.map(
      (materia, indice) => ({

        "@type": "ListItem",

        "position": indice + 1,

        "url": urlAbsoluta(
          materia.url
        ),

        "name": materia.titulo

      })
    )

  };

  const script = document.createElement(
    "script"
  );

  script.type = "application/ld+json";

  script.dataset.schemaMaterias = "true";

  script.textContent = JSON.stringify(
    dados
  );

  document.head.appendChild(
    script
  );

}


/* ==========================================
   INICIALIZAÇÃO DO SISTEMA

   EXECUTA QUANDO O HTML
   TERMINA DE CARREGAR.
========================================== */

function iniciarSistemaMaterias() {

  validarCategorias();

  renderizarDestaquePrincipal();

  renderizarUltimasMaterias();

  renderizarTodasMaterias();

  renderizarPaginaCategoria();

  adicionarDadosEstruturados();

}

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarSistemaMaterias
  );

} else {

  iniciarSistemaMaterias();

}
