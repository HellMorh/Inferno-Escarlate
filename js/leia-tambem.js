
/* ==========================================
   LEIA TAMBÉM AUTOMÁTICO
   INFERNO ESCARLATE
========================================== */

function iniciarLeiaTambem() {

  /* ==========================================
     LOCALIZA O CONTAINER
  ========================================== */

  const container = document.querySelector(
    "#leia-tambem-lista"
  );

  if (!container) return;

  /* ==========================================
     VERIFICA O CATÁLOGO
  ========================================== */

  if (typeof MATERIAS === "undefined") {

    console.warn(
      "Leia Também: catálogo de matérias não encontrado."
    );

    return;
  }

  /* ==========================================
     URL BASE DO SITE
  ========================================== */

  const SITE_LEIA_TAMBEM =
    "https://infernoescarlate.com/";

  /* ==========================================
     PROTEGE O CONTEÚDO INSERIDO NO HTML
  ========================================== */

  function escaparHTML(texto) {

    return String(texto ?? "").replace(
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

  /* ==========================================
     NORMALIZA CAMINHOS
  ========================================== */

  function obterURL(caminho) {

    return new URL(
      caminho,
      SITE_LEIA_TAMBEM
    );

  }

  /* ==========================================
     IDENTIFICA A MATÉRIA ATUAL
  ========================================== */

  const caminhoAtual =
    window.location.pathname;

  const materiaAtual = MATERIAS.find(
    (materia) => {

      return (
        obterURL(materia.url).pathname ===
        caminhoAtual
      );

    }
  );

  /* ==========================================
     REMOVE A PRÓPRIA MATÉRIA
  ========================================== */

  const outrasMaterias = MATERIAS.filter(
    (materia) => {

      return (
        obterURL(materia.url).pathname !==
        caminhoAtual
      );

    }
  );

  /* ==========================================
     CALCULA AFINIDADE ENTRE CATEGORIAS
  ========================================== */

  function calcularAfinidade(materia) {

    if (!materiaAtual) return 0;

    return materia.categorias.filter(
      (categoria) => {

        return materiaAtual.categorias.includes(
          categoria
        );

      }
    ).length;

  }

  /* ==========================================
     ORGANIZA AS RECOMENDAÇÕES
  ========================================== */

  const recomendadas = [...outrasMaterias]
    .sort((a, b) => {

      const afinidadeA =
        calcularAfinidade(a);

      const afinidadeB =
        calcularAfinidade(b);

      if (afinidadeA !== afinidadeB) {

        return afinidadeB - afinidadeA;

      }

      return (
        new Date(b.data) -
        new Date(a.data)
      );

    })
    .slice(0, 3);

  /* ==========================================
     ESCONDE SE NÃO HOUVER RECOMENDAÇÕES
  ========================================== */

  if (recomendadas.length === 0) {

    const secao = container.closest(
      ".leia-tambem-automatico"
    );

    if (secao) {

      secao.hidden = true;

    }

    return;
  }

  /* ==========================================
     MONTA OS CARDS AUTOMATICAMENTE
  ========================================== */

  container.innerHTML = recomendadas
    .map((materia) => {

      const link =
        obterURL(materia.url).pathname;

      const imagem =
        obterURL(materia.imagem).pathname;

      return `
        <article class="leia-tambem-item">

          <a
            href="${escaparHTML(link)}"
            class="leia-tambem-imagem"
            aria-label="Ler: ${escaparHTML(materia.titulo)}"
          >

            <img
              src="${escaparHTML(imagem)}"
              alt="${escaparHTML(materia.alt)}"
              loading="lazy"
            >

          </a>

          <div class="leia-tambem-conteudo">

            <span class="leia-tambem-categoria">
              ${escaparHTML(materia.categoriaTexto)}
            </span>

            <h3>

              <a href="${escaparHTML(link)}">
                ${escaparHTML(materia.titulo)}
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
    iniciarLeiaTambem
  );

} else {

  iniciarLeiaTambem();

}
