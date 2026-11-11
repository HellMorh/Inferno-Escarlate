
/* ==========================================
   INFERNO ESCARLATE
   RECOMENDAÇÕES AUTOMÁTICAS

   LEIA TAMBÉM:
   Matérias relacionadas.

   MAIS MATÉRIAS:
   Exclusivamente Cinema.

   Sem repetir artigos entre os blocos.
   Compatível com Pages CMS e Eleventy.
========================================== */

(async function () {
  "use strict";

  if (document.readyState === "loading") {
    await new Promise(function (resolver) {
      document.addEventListener(
        "DOMContentLoaded",
        resolver,
        { once: true }
      );
    });
  }

  const leiaTambem = document.getElementById(
    "leia-tambem-lista"
  );

  const maisMaterias = document.getElementById(
    "mais-materias-automaticas"
  );

  if (!leiaTambem && !maisMaterias) return;

  /* ==========================================
     FUNÇÕES AUXILIARES
  ========================================== */

  function caminho(url) {
    try {
      const destino = new URL(
        url,
        window.location.origin + "/"
      );

      return destino.origin === window.location.origin
        ? destino.pathname
        : "";
    } catch (erro) {
      return "";
    }
  }

  function normalizar(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function categorias(materia) {
    return Array.isArray(materia.categorias)
      ? materia.categorias.map(normalizar)
      : [];
  }

  function ehCinema(materia) {
    return categorias(materia).includes("cinema");
  }

  function data(materia) {
    const valor =
      materia.data ||
      materia.dataPublicacao ||
      "";

    const resultado = Date.parse(valor);
    return Number.isFinite(resultado)
      ? resultado
      : 0;
  }

  function ordenar(materias) {
    return [...materias].sort(function (a, b) {
      return data(b) - data(a);
    });
  }

  function escapar(valor) {
    return String(valor ?? "").replace(
      /[&<>"']/g,
      function (caractere) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[caractere];
      }
    );
  }

  /* ==========================================
     REUNIR MATÉRIAS ANTIGAS E NOVAS
  ========================================== */

  const mapa = new Map();

  const antigas =
    typeof MATERIAS !== "undefined"
      ? [...MATERIAS]
      : [];

  let novas = [];

  try {
    const resposta = await fetch(
      "/dados/materias.json",
      { cache: "no-cache" }
    );

    if (resposta.ok) {
      const dados = await resposta.json();

      if (Array.isArray(dados)) {
        novas = dados;
      }
    }
  } catch (erro) {
    console.warn(
      "Recomendações: catálogo indisponível.",
      erro
    );
  }

  [...antigas, ...novas].forEach(function (materia) {
    if (!materia || !materia.url) return;

    const identificador = caminho(materia.url);

    if (identificador) {
      mapa.set(identificador, materia);
    }
  });

  const atual = window.location.pathname;

  const materiaAtual = mapa.get(atual);

  const disponiveis = [...mapa.values()].filter(
    function (materia) {
      return caminho(materia.url) !== atual;
    }
  );

  /* ==========================================
     RESERVAR ARTIGOS PARA CINEMA

     Quando houver poucas matérias,
     preservamos pelo menos uma opção
     para o bloco Mais matérias.
  ========================================== */

  const cinema = ordenar(
    disponiveis.filter(ehCinema)
  );

  const quantidadeReservada = cinema.length
    ? Math.min(
        3,
        cinema.length,
        Math.max(1, disponiveis.length - 3)
      )
    : 0;

  const reservadasCinema = cinema.slice(
    0,
    quantidadeReservada
  );

  const caminhosReservados = new Set(
    reservadasCinema.map(function (materia) {
      return caminho(materia.url);
    })
  );

  /* ==========================================
     LEIA TAMBÉM
     PRIORIZAR ASSUNTOS RELACIONADOS
  ========================================== */

  const categoriasAtuais = materiaAtual
    ? categorias(materiaAtual)
    : [];

  function afinidade(materia) {
    return categorias(materia).filter(
      function (categoria) {
        return categoriasAtuais.includes(categoria);
      }
    ).length;
  }

  const recomendadasLeia = disponiveis
    .filter(function (materia) {
      return !caminhosReservados.has(
        caminho(materia.url)
      );
    })
    .sort(function (a, b) {
      const diferenca =
        afinidade(b) - afinidade(a);

      return diferenca !== 0
        ? diferenca
        : data(b) - data(a);
    })
    .slice(0, 3);

  const utilizadasLeia = new Set(
    recomendadasLeia.map(function (materia) {
      return caminho(materia.url);
    })
  );

  /* ==========================================
     MAIS MATÉRIAS
     APENAS CINEMA, SEM REPETIÇÕES
  ========================================== */

  const recomendadasCinema = cinema
    .filter(function (materia) {
      return !utilizadasLeia.has(
        caminho(materia.url)
      );
    })
    .slice(0, 3);

  /* ==========================================
     RENDERIZAR LEIA TAMBÉM
  ========================================== */

  if (leiaTambem) {
    const secao = leiaTambem.closest(
      ".leia-tambem-automatico"
    );

    if (secao) {
      secao.hidden = recomendadasLeia.length === 0;
    }

    leiaTambem.innerHTML = recomendadasLeia
      .map(function (materia) {
        const url = caminho(materia.url);

        const titulo = escapar(
          materia.titulo || ""
        );

        const imagem = materia.imagem
          ? caminho(materia.imagem)
          : "";

        const categoria = escapar(
          materia.categoriaTexto ||
          "Cultura pop"
        );

        const alt = escapar(
          materia.imagemAlt ||
          materia.alt ||
          materia.titulo ||
          ""
        );

        return `
          <article class="leia-tambem-item">
            <a
              href="${escapar(url)}"
              class="leia-tambem-imagem"
              aria-label="Ler: ${titulo}"
            >
              ${imagem ? `
                <img
                  src="${escapar(imagem)}"
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
                <a href="${escapar(url)}">
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
     RENDERIZAR MAIS MATÉRIAS
     COM OS CARDS ORIGINAIS
  ========================================== */

  if (maisMaterias) {
    const secao = maisMaterias.closest(
      ".mais-materias"
    );

    if (secao) {
      secao.hidden = recomendadasCinema.length === 0;
    }

    if (
      recomendadasCinema.length &&
      typeof renderizarLista === "function"
    ) {
      renderizarLista(
        maisMaterias,
        recomendadasCinema,
        "../"
      );
    }
  }

  console.log(
    "Inferno Escarlate: recomendações carregadas.",
    {
      leiaTambem: recomendadasLeia.length,
      cinema: recomendadasCinema.length
    }
  );

})();
