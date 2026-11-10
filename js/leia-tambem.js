
/* ==========================================
   INFERNO ESCARLATE
   LEIA TAMBÉM AUTOMÁTICO

   Integra matérias antigas e novas
   publicadas pelo Pages CMS e Eleventy.
========================================== */

async function iniciarLeiaTambem() {

  const container = document.querySelector(
    "#leia-tambem-lista"
  );

  if (!container) return;

  const SITE = "https://infernoescarlate.com/";

  /* ==========================================
     FUNÇÕES AUXILIARES
  ========================================== */

  function escaparHTML(valor) {
    return String(valor ?? "").replace(
      /[&<>"']/g,
      (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[caractere]
    );
  }

  function obterURL(caminho) {
    return new URL(
      String(caminho || ""),
      SITE
    );
  }

  function obterCaminho(caminho) {
    return obterURL(caminho).pathname;
  }

  /* ==========================================
     MATÉRIAS ANTIGAS
  ========================================== */

  let lista = [];

  if (typeof MATERIAS !== "undefined") {
    lista = [...MATERIAS];
  }

  /* ==========================================
     MATÉRIAS DO PAGES CMS
     AGUARDA O CATÁLOGO AUTOMÁTICO
  ========================================== */

  try {

    const resposta = await fetch(
      "/dados/materias.json",
      { cache: "no-cache" }
    );

    if (resposta.ok) {

      const automaticas = await resposta.json();

      if (Array.isArray(automaticas)) {

        const mapa = new Map();

        lista.forEach((materia) => {
          if (materia?.url) {
            mapa.set(
              obterCaminho(materia.url),
              materia
            );
          }
        });

        automaticas.forEach((materia) => {

          if (!materia?.url || !materia?.titulo) {
            return;
          }

          mapa.set(
            obterCaminho(materia.url),
            materia
          );

        });

        lista = [...mapa.values()];

      }

    }

  } catch (erro) {

    console.warn(
      "Leia Também: catálogo automático indisponível.",
      erro
    );

  }

  /* ==========================================
     IDENTIFICAR MATÉRIA ATUAL
  ========================================== */

  const caminhoAtual = window.location.pathname;

  const materiaAtual = lista.find(
    (materia) => {
      return obterCaminho(materia.url) === caminhoAtual;
    }
  );

  /* ==========================================
     REMOVER MATÉRIA ATUAL
  ========================================== */

  const outrasMaterias = lista.filter(
    (materia) => {
      return (
        materia.url &&
        obterCaminho(materia.url) !== caminhoAtual
      );
    }
  );

  /* ==========================================
     AFINIDADE ENTRE CATEGORIAS
  ========================================== */

  function calcularAfinidade(materia) {

    if (!materiaAtual) return 0;

    const categoriasAtuais = Array.isArray(
      materiaAtual.categorias
    ) ? materiaAtual.categorias : [];

    const categorias = Array.isArray(
      materia.categorias
    ) ? materia.categorias : [];

    return categorias.filter(
      (categoria) => categoriasAtuais.includes(categoria)
    ).length;

  }

  /* ==========================================
     PRIORIZAR ASSUNTOS RELACIONADOS
     E MATÉRIAS RECENTES
  ========================================== */

  const recomendadas = outrasMaterias
    .sort((a, b) => {

      const afinidade =
        calcularAfinidade(b) -
        calcularAfinidade(a);

      if (afinidade !== 0) {
        return afinidade;
      }

      return (
        new Date(b.data || 0) -
        new Date(a.data || 0)
      );

    })
    .slice(0, 3);

  const secao = container.closest(
    ".leia-tambem-automatico"
  );

  if (!recomendadas.length) {

    if (secao) secao.hidden = true;

    return;
  }

  if (secao) secao.hidden = false;

  /* ==========================================
     GERAR RECOMENDAÇÕES
  ========================================== */

  container.innerHTML = recomendadas
    .map((materia) => {

      const link = obterCaminho(materia.url);

      const imagem = materia.imagem
        ? obterCaminho(materia.imagem)
        : "";

      const titulo = escaparHTML(
        materia.titulo
      );

      const categoria = escaparHTML(
        materia.categoriaTexto || "Cultura pop"
      );

      const alt = escaparHTML(
        materia.alt || materia.titulo
      );

      return `
        <article class="leia-tambem-item">

          <a
            href="${escaparHTML(link)}"
            class="leia-tambem-imagem"
            aria-label="Ler: ${titulo}"
          >
            ${imagem ? `
              <img
                src="${escaparHTML(imagem)}"
                alt="${alt}"
                loading="lazy"
              >
            ` : ""}
          </a>

          <div class="leia-tambem-conteudo">

            <span class="leia-tambem-categoria">
              ${categoria}
            </span>

            <h3>
              <a href="${escaparHTML(link)}">
                ${titulo}
              </a>
            </h3>

          </div>

        </article>
      `;

    })
    .join("");

}

/* ==========================================
   INICIALIZAÇÃO
========================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarLeiaTambem,
    { once: true }
  );

} else {

  iniciarLeiaTambem();

}
