/* ==========================================================
   CATÁLOGO DE MATÉRIAS — INFERNO ESCARLATE
========================================================== */

const MATERIAS = [

  /* ROCK IN RIO 2026 */

  {
    titulo:
      "Faltou rock mais uma vez quando o assunto é Rock In Rio 2026?",

    resumo:
      "Foo Fighters, Rise Against, Detonautas, Capital Inicial e outros abrem uma edição que reacende o debate sobre o espaço do rock.",

    imagem:
      "imagem/rock-in-rio-foo-fighters.jpg",

    alt:
      "Foo Fighters no Rock in Rio 2026",

    url:
      "posts/materia-rock-in-rio-2026.html",

    categorias: [
      "musica",
      "eventos",
      "festivais"
    ],

    categoriaTexto:
      "Música • Festivais",

    data:
      "2026-09-05T12:00:00",

    destaque: true
  },


  /* BTS */

  {
    titulo:
      "BTS em Copacabana? Confira os rumores",

    resumo:
      "Entenda os rumores sobre uma possível apresentação do grupo no Rio de Janeiro.",

    imagem:
      "imagem/materia-bts.jpg",

    alt:
      "BTS em Copacabana",

    url:
      "posts/materia-bts.html",

    categorias: [
      "musica"
    ],

    categoriaTexto:
      "Música",

    data:
      "2026-06-28T12:00:00",

    destaque: false
  },


  /* CAUBY PRO ROCK */

  {
    titulo:
      "Niterói apresenta o Cauby Pro Rock",

    resumo:
      "Evento reúne música, cultura e artistas da cena independente.",

    imagem:
      "imagem/materia-cauby.jpg",

    alt:
      "Cauby Pro Rock",

    url:
      "posts/materia-cauby.html",

    categorias: [
      "eventos",
      "musica"
    ],

    categoriaTexto:
      "Eventos",

    data:
      "2026-06-28T11:00:00",

    destaque: false
  },


  /* SPIDER-MAN */

  {
    titulo:
      "Spider-Man: Brand New Day inicia uma nova fase",

    resumo:
      "Uma nova etapa para Peter Parker nos cinemas.",

    imagem:
      "imagem/materia-03.jpg",

    alt:
      "Spider-Man Brand New Day",

    url:
      "posts/materia-03.html",

    categorias: [
      "cinema"
    ],

    categoriaTexto:
      "Cinema",

    data:
      "2026-06-28T10:00:00",

    destaque: false
  },


  /* UNIVERSAL */

  {
    titulo:
      "Dona da Universal Pictures planeja separação em duas empresas",

    resumo:
      "A Comcast anunciou um plano de reestruturação envolvendo a NBCUniversal e a Sky.",

    imagem:
      "imagem/universal.jpg",

    alt:
      "Universal Pictures e mercado audiovisual",

    url:
      "posts/universal.html",

    categorias: [
      "cinema",
      "series"
    ],

    categoriaTexto:
      "Cinema e televisão",

    data:
      "2026-06-27T12:00:00",

    destaque: false
  }

];



/* ==========================================================
   NÃO ALTERE DAQUI PARA BAIXO
========================================================== */


function ordenarMaterias(lista) {

  return [...lista].sort((a, b) => {

    return (
      new Date(b.data) -
      new Date(a.data)
    );

  });

}



function caminhoComPrefixo(
  prefixo,
  caminho
) {

  return `${prefixo || ""}${caminho}`;

}



/* ==========================================================
   CARD PADRÃO
========================================================== */

function criarCardMateria(
  materia,
  prefixo = ""
) {

  const categorias =
    materia.categorias.join(" ");


  return `

    <article
      class="card-materia"
      data-categoria="${categorias}"
    >

      <img
        src="${caminhoComPrefixo(
          prefixo,
          materia.imagem
        )}"
        alt="${materia.alt}"
        loading="lazy"
      >

      <div class="card-conteudo">

        <span class="categoria">
          ${materia.categoriaTexto}
        </span>

        <h3>
          ${materia.titulo}
        </h3>

        <p>
          ${materia.resumo}
        </p>

        <a
          href="${caminhoComPrefixo(
            prefixo,
            materia.url
          )}"
        >
          Ler matéria
        </a>

      </div>

    </article>

  `;

}



/* ==========================================================
   RENDERIZA UMA LISTA
========================================================== */

function renderizarLista(
  container,
  lista,
  prefixo = ""
) {

  if (!container) {
    return;
  }


  container.innerHTML =
    lista
      .map((materia) =>
        criarCardMateria(
          materia,
          prefixo
        )
      )
      .join("");

}



/* ==========================================================
   DESTAQUE PRINCIPAL DA HOME
========================================================== */

function renderizarDestaquePrincipal() {

  const container =
    document.querySelector(
      "#destaque-principal"
    );


  if (!container) {
    return;
  }


  const materiasOrdenadas =
    ordenarMaterias(MATERIAS);


  const materia =
    materiasOrdenadas.find(
      (item) => item.destaque === true
    )
    ||
    materiasOrdenadas[0];


  if (!materia) {
    return;
  }


  container.innerHTML = `

    <div class="destaque-imagem">

      <img
        src="${materia.imagem}"
        alt="${materia.alt}"
      >

    </div>


    <div class="destaque-conteudo">

      <span class="categoria">
        ${materia.categoriaTexto}
      </span>

      <h2>
        ${materia.titulo}
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



/* ==========================================================
   ÚLTIMAS MATÉRIAS DA HOME
========================================================== */

function renderizarUltimasMaterias() {

  const container =
    document.querySelector(
      "#ultimas-materias"
    );


  if (!container) {
    return;
  }


  const ultimas =
    ordenarMaterias(MATERIAS)
      .slice(0, 3);


  renderizarLista(
    container,
    ultimas,
    ""
  );

}



/* ==========================================================
   TODAS AS MATÉRIAS
========================================================== */

function renderizarTodasMaterias() {

  const container =
    document.querySelector(
      "#todas-materias"
    );


  if (!container) {
    return;
  }


  renderizarLista(

    container,

    ordenarMaterias(
      MATERIAS
    ),

    ""

  );


  ativarFiltros();

}



/* ==========================================================
   PÁGINAS DE CATEGORIA
========================================================== */

function renderizarPaginaCategoria() {

  const container =
    document.querySelector(
      "#categoria-materias"
    );


  if (!container) {
    return;
  }


  const categoria =
    document.body.dataset
      .categoriaPagina;


  if (!categoria) {
    return;
  }


  const lista =
    ordenarMaterias(MATERIAS)
      .filter((materia) => {

        return materia.categorias
          .includes(categoria);

      });


  renderizarLista(
    container,
    lista,
    "../"
  );

}



/* ==========================================================
   FILTROS DE materias.html
========================================================== */

function ativarFiltros() {

  const botoes =
    document.querySelectorAll(
      "[data-filtro]"
    );


  const cards =
    document.querySelectorAll(
      "#todas-materias [data-categoria]"
    );


  if (
    !botoes.length ||
    !cards.length
  ) {

    return;

  }


  botoes.forEach((botao) => {

    botao.addEventListener(
      "click",
      () => {

        const filtro =
          botao.dataset.filtro;


        botoes.forEach((item) => {

          item.classList.remove(
            "ativo"
          );

        });


        botao.classList.add(
          "ativo"
        );


        cards.forEach((card) => {

          const categorias =
            card.dataset
              .categoria
              .trim()
              .split(/\s+/);


          const mostrar =
            filtro === "todas" ||
            categorias.includes(
              filtro
            );


          card.style.display =
            mostrar
              ? ""
              : "none";

        });

      }
    );

  });

}



/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderizarDestaquePrincipal();

    renderizarUltimasMaterias();

    renderizarTodasMaterias();

    renderizarPaginaCategoria();

  }
);