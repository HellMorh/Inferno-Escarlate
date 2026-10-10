
/* ==========================================
   CATÁLOGO DE MATÉRIAS — INFERNO ESCARLATE
========================================== */

const MATERIAS = [
  {
    titulo: "Se Eu Fosse Você 3 aposta na mesma fórmula e garante nostalgia",
    resumo: "Cleo Pires e Rafael Infante assumem o protagonismo da franquia e dão uma nova cara à comédia marcada por Glória Pires e Tony Ramos.",
    imagem: "imagem/se-eu-fosse-voce-3-capa.jpg",
    alt: "Filme Se Eu Fosse Você 3, com Cleo Pires e Rafael Infante",
    url: "posts/se-eu-fosse-voce-3.html",
    categorias: ["cinema", "criticas"],
    categoriaTexto: "Cinema nacional • Crítica",
    data: "2026-10-10T15:00:00",
    destaque: false
  },
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
  {
    titulo: "BTS em Copacabana? Confira os rumores",
    resumo: "Entenda os rumores sobre uma possível apresentação do grupo no Rio de Janeiro.",
    imagem: "imagem/materia-bts.jpg",
    alt: "BTS em Copacabana",
    url: "posts/materia-bts.html",
    categorias: ["musica"],
    categoriaTexto: "Música",
    data: "2026-06-28T12:00:00",
    destaque: false
  },
  {
    titulo: "Niterói apresenta o Cauby Pro Rock",
    resumo: "Evento reúne música, cultura e artistas da cena independente.",
    imagem: "imagem/materia-cauby.jpg",
    alt: "Cauby Pro Rock",
    url: "posts/materia-cauby.html",
    categorias: ["eventos", "musica"],
    categoriaTexto: "Eventos",
    data: "2026-06-28T11:00:00",
    destaque: false
  },
  {
    titulo: "Spider-Man: Brand New Day inicia uma nova fase",
    resumo: "Uma nova etapa para Peter Parker nos cinemas.",
    imagem: "imagem/materia-03.jpg",
    alt: "Spider-Man Brand New Day",
    url: "posts/materia-03.html",
    categorias: ["cinema"],
    categoriaTexto: "Cinema",
    data: "2026-06-28T10:00:00",
    destaque: false
  },
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
   ORDENAÇÃO
========================================== */

function ordenarMaterias(lista) {
  return [...lista].sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });
}

/* ==========================================
   CAMINHOS DOS ARQUIVOS
========================================== */

function caminhoComPrefixo(prefixo, caminho) {
  return `${prefixo || ""}${caminho}`;
}

/* ==========================================
   CARD DE MATÉRIA
========================================== */

function criarCardMateria(materia, prefixo = "") {
  const categorias = materia.categorias.join(" ");
  const url = caminhoComPrefixo(prefixo, materia.url);
  const imagem = caminhoComPrefixo(prefixo, materia.imagem);

  return `
    <article
      class="card-materia"
      data-categoria="${categorias}"
    >
      <a
        href="${url}"
        class="link-imagem-materia"
        aria-label="Ler: ${materia.titulo}"
      >
        <img
          src="${imagem}"
          alt="${materia.alt}"
          loading="lazy"
        >
      </a>

      <div class="card-conteudo">
        <span class="categoria">
          ${materia.categoriaTexto}
        </span>

        <h3>
          <a
            href="${url}"
            class="link-titulo-materia"
          >
            ${materia.titulo}
          </a>
        </h3>

        <p>${materia.resumo}</p>

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
   RENDERIZAR LISTA
========================================== */

function renderizarLista(container, lista, prefixo = "") {
  if (!container) return;

  container.innerHTML = lista
    .map((materia) => criarCardMateria(materia, prefixo))
    .join("");
}

/* ==========================================
   DESTAQUE PRINCIPAL
========================================== */

function renderizarDestaquePrincipal() {
  const container = document.querySelector("#destaque-principal");

  if (!container) return;

  const materiasOrdenadas = ordenarMaterias(MATERIAS);

  const materia =
    materiasOrdenadas.find((item) => item.destaque === true) ||
    materiasOrdenadas[0];

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

      <p>${materia.resumo}</p>

      <a href="${materia.url}" class="botao">
        Ler matéria
      </a>
    </div>
  `;
}

/* ==========================================
   ÚLTIMAS MATÉRIAS
========================================== */

function renderizarUltimasMaterias() {
  const container = document.querySelector("#ultimas-materias");

  if (!container) return;

  const ultimas = ordenarMaterias(MATERIAS).slice(0, 3);

  renderizarLista(container, ultimas);
}

/* ==========================================
   TODAS AS MATÉRIAS
========================================== */

function renderizarTodasMaterias() {
  const container = document.querySelector("#todas-materias");

  if (!container) return;

  renderizarLista(container, ordenarMaterias(MATERIAS));

  ativarFiltros();
}

/* ==========================================
   PÁGINAS DE CATEGORIAS
========================================== */

function renderizarPaginaCategoria() {
  const container = document.querySelector("#categoria-materias");

  if (!container) return;

  const categoria = document.body.dataset.categoriaPagina;

  if (!categoria) return;

  const lista = ordenarMaterias(MATERIAS).filter((materia) => {
    return materia.categorias.includes(categoria);
  });

  renderizarLista(container, lista, "../");
}

/* ==========================================
   FILTROS DA PÁGINA materias.html
========================================== */

function ativarFiltros() {
  const botoes = document.querySelectorAll(
    ".filtros-materias [data-filtro]"
  );

  const container = document.querySelector("#todas-materias");

  if (!container || !botoes.length) return;

  const cards = [...container.querySelectorAll("[data-categoria]")];
  const aviso = document.querySelector("#sem-materias");

  function aplicarFiltro(filtro) {
    let quantidadeVisivel = 0;

    cards.forEach((card) => {
      const categorias = card.dataset.categoria
        .trim()
        .split(/\s+/);

      const mostrar =
        filtro === "todas" || categorias.includes(filtro);

      card.style.display = mostrar ? "" : "none";

      if (mostrar) quantidadeVisivel++;
    });

    botoes.forEach((botao) => {
      const ativo = botao.dataset.filtro === filtro;

      botao.classList.toggle("ativo", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
    });

    if (aviso) {
      aviso.classList.toggle(
        "visivel",
        quantidadeVisivel === 0
      );
    }
  }

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      aplicarFiltro(botao.dataset.filtro);
    });
  });

  const filtroInicial =
    document.querySelector(".filtros-materias .ativo")
      ?.dataset.filtro || "todas";

  aplicarFiltro(filtroInicial);
}

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderizarDestaquePrincipal();
  renderizarUltimasMaterias();
  renderizarTodasMaterias();
  renderizarPaginaCategoria();
});
