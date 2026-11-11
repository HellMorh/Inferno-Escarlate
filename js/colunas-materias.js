
/* ==========================================
   INFERNO ESCARLATE
   PUBLICAÇÕES AUTOMÁTICAS DAS COLUNAS

   Integração com Pages CMS e Eleventy
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

  const grade = document.querySelector(".grade-idol");
  const aviso = document.querySelector(".idol-sem-materias");

  if (!grade) return;

  function normalizar(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function enderecoSeguro(caminho) {
    try {
      const url = new URL(caminho, window.location.origin);

      return url.origin === window.location.origin
        ? url.pathname
        : "";
    } catch (erro) {
      return "";
    }
  }

  /* ==========================================
     IDENTIFICAÇÃO DA COLUNA
  ========================================== */

  const nomesDaColuna = [
    "Idol Archive",
    "Arquivo Idol"
  ].map(normalizar);

  /* ==========================================
     BUSCAR MATÉRIAS PUBLICADAS
  ========================================== */

  try {
    const resposta = await fetch(
      "/dados/materias.json",
      { cache: "no-cache" }
    );

    if (!resposta.ok) {
      throw new Error("Catálogo indisponível");
    }

    const catalogo = await resposta.json();

    if (!Array.isArray(catalogo)) {
      throw new Error("Formato inválido do catálogo");
    }

    const materias = catalogo
      .filter(function (materia) {
        const coluna = normalizar(materia.coluna);

        return nomesDaColuna.includes(coluna);
      })
      .filter(function (materia) {
        return (
          materia.url &&
          (materia.titulo || materia.title) &&
          enderecoSeguro(materia.url)
        );
      })
      .sort(function (a, b) {
        const dataA = Date.parse(
          a.data || a.dataPublicacao || ""
        ) || 0;

        const dataB = Date.parse(
          b.data || b.dataPublicacao || ""
        ) || 0;

        return dataB - dataA;
      });

    if (!materias.length) {
      grade.replaceChildren();

      if (aviso) {
        aviso.hidden = false;
      }

      return;
    }

    /* ==========================================
       CRIAR CARDS SEM ALTERAR OS ARTIGOS
    ========================================== */

    const fragmento = document.createDocumentFragment();

    materias.forEach(function (materia) {
      const artigo = document.createElement("article");
      artigo.className = "card-coluna-automatico";

      const link = document.createElement("a");
      link.href = enderecoSeguro(materia.url);
      link.className = "link-coluna-automatico";

      if (materia.imagem) {
        const imagemURL = enderecoSeguro(materia.imagem);

        if (imagemURL) {
          const imagem = document.createElement("img");

          imagem.src = imagemURL;
          imagem.alt =
            materia.imagemAlt ||
            materia.alt ||
            materia.titulo ||
            materia.title ||
            "";

          imagem.loading = "lazy";

          link.appendChild(imagem);
        }
      }

      const conteudo = document.createElement("div");
      conteudo.className = "conteudo-coluna-automatico";

      const titulo = document.createElement("h3");
      titulo.textContent = materia.titulo || materia.title;

      conteudo.appendChild(titulo);

      const resumo = materia.resumo || materia.descricao ||
                     materia.description || "";

      if (resumo) {
        const paragrafo = document.createElement("p");
        paragrafo.textContent = resumo;

        conteudo.appendChild(paragrafo);
      }

      const chamada = document.createElement("span");
      chamada.textContent = "Ler matéria →";

      conteudo.appendChild(chamada);
      link.appendChild(conteudo);
      artigo.appendChild(link);
      fragmento.appendChild(artigo);
    });

    grade.replaceChildren(fragmento);

    if (aviso) {
      aviso.hidden = true;
    }

    /* ==========================================
       ESTILO DOS CARDS
       EXCLUSIVO DA COLUNA
    ========================================== */

    if (!document.getElementById("css-colunas-automaticas")) {
      const estilo = document.createElement("style");
      estilo.id = "css-colunas-automaticas";

      estilo.textContent = `
        .idol-sem-materias[hidden] {
          display: none !important;
        }

        .grade-idol {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: 28px;
        }

        .card-coluna-automatico {
          min-width: 0;
          overflow: hidden;
          background: #101010;
          border: 1px solid #292929;
        }

        .link-coluna-automatico {
          display: block;
          height: 100%;
          color: #fff;
          text-decoration: none;
        }

        .link-coluna-automatico img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
        }

        .conteudo-coluna-automatico {
          padding: 22px;
        }

        .conteudo-coluna-automatico h3 {
          margin: 0 0 12px;
          color: #fff;
          font-size: 1.3rem;
          line-height: 1.3;
        }

        .conteudo-coluna-automatico p {
          margin: 0 0 18px;
          color: #aaa;
          line-height: 1.6;
        }

        .conteudo-coluna-automatico span {
          color: #ff4356;
          font-weight: 700;
        }

        .card-coluna-automatico:hover {
          border-color: #ff4356;
        }
      `;

      document.head.appendChild(estilo);
    }

    console.log(
      "Idol Archive: " +
      materias.length +
      " matéria(s) carregada(s)."
    );

  } catch (erro) {
    console.error(
      "Erro ao carregar matérias da Idol Archive:",
      erro
    );
  }

})();
