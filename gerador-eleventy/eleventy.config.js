
/* ==========================================
   INFERNO ESCARLATE
   GERADOR DEFINITIVO DE MATÉRIAS
========================================== */

module.exports = function (eleventyConfig) {

  // ==========================================
  // ARQUIVOS IGNORADOS
  // ==========================================

  // Ignora o projeto antigo de testes.
  eleventyConfig.ignores.add("teste-eleventy/**");

  // Não transforma o README em página HTML.
  eleventyConfig.ignores.add("README.md");

  // Ignora arquivos gerados anteriormente.
  eleventyConfig.ignores.add("gerador-eleventy/_site/**");


  // ==========================================
  // LEGENDAS E CRÉDITOS DAS IMAGENS INTERNAS
  // ==========================================

  // Compara os caminhos das imagens, mesmo quando
  // possuem espaços codificados como %20.
  function normalizarImagem(caminho) {
    if (!caminho) {
      return "";
    }

    let resultado = String(caminho).trim();

    try {
      resultado = decodeURIComponent(resultado);
    } catch (erro) {
      // Mantém o caminho original caso não seja
      // possível decodificar a URL.
    }

    return resultado
      .replace(/\\/g, "/")
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/[?#].*$/, "")
      .replace(/^\/+/, "");
  }

  // Procura as informações cadastradas no Pages CMS.
  function encontrarImagem(src, dados) {
    if (!Array.isArray(dados)) {
      return null;
    }

    const caminho = normalizarImagem(src);

    return dados.find(function (item) {
      return item &&
        normalizarImagem(item.imagem) === caminho;
    }) || null;
  }

  // Utiliza o processador Markdown já fornecido
  // pelo Eleventy. Não precisa instalar pacotes.
  eleventyConfig.amendLibrary("md", function (md) {

    const renderizarImagemOriginal =
      md.renderer.rules.image ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    // Identifica imagens que ocupam um parágrafo
    // próprio e possuem legenda ou crédito.
    md.core.ruler.after(
      "inline",
      "identificar-imagens-internas",
      function (state) {

        const tokens = state.tokens;
        const dados = state.env.imagensInternas;

        if (!Array.isArray(dados) || !dados.length) {
          return;
        }

        for (let i = 0; i < tokens.length - 2; i++) {

          const abertura = tokens[i];
          const conteudo = tokens[i + 1];
          const fechamento = tokens[i + 2];

          if (
            abertura.type !== "paragraph_open" ||
            conteudo.type !== "inline" ||
            fechamento.type !== "paragraph_close"
          ) {
            continue;
          }

          const filhos = conteudo.children || [];

          // Não altera imagens inseridas junto
          // de texto no mesmo parágrafo.
          if (
            filhos.length !== 1 ||
            filhos[0].type !== "image"
          ) {
            continue;
          }

          const imagem = filhos[0];
          const src = imagem.attrGet("src");

          const informacoes = encontrarImagem(
            src,
            dados
          );

          if (!informacoes) {
            continue;
          }

          const legenda = String(
            informacoes.legenda || ""
          ).trim();

          const credito = String(
            informacoes.credito || ""
          ).trim();

          if (!legenda && !credito) {
            continue;
          }

          imagem.meta = {
            ...(imagem.meta || {}),
            dadosImagemInterna: {
              legenda: legenda,
              credito: credito
            }
          };

          // Evita colocar <figure> dentro de <p>.
          abertura.hidden = true;
          fechamento.hidden = true;
        }
      }
    );

    // Monta a imagem com legenda e crédito.
    md.renderer.rules.image = function (
      tokens,
      idx,
      options,
      env,
      self
    ) {

      const token = tokens[idx];

      const imagemOriginal = renderizarImagemOriginal(
        tokens,
        idx,
        options,
        env,
        self
      );

      const dados = token.meta &&
        token.meta.dadosImagemInterna;

      // Imagens sem informações cadastradas
      // continuam exatamente como antes.
      if (!dados) {
        return imagemOriginal;
      }

      const escapar = md.utils.escapeHtml;

      let legendaHTML = "";

      if (dados.legenda) {
        legendaHTML +=
          '<span class="legenda-imagem">' +
          escapar(dados.legenda) +
          '</span>';
      }

      if (dados.credito) {
        legendaHTML +=
          '<span class="credito-imagem">' +
          'Crédito: ' +
          escapar(dados.credito) +
          '</span>';
      }

      return (
        '<figure class="imagem-materia">' +
          imagemOriginal +
          '<figcaption>' +
            legendaHTML +
          '</figcaption>' +
        '</figure>'
      );
    };
  });


  // ==========================================
  // COLEÇÃO DE MATÉRIAS
  // ==========================================

  // Reúne as matérias escritas pelo Pages CMS.
  eleventyConfig.addCollection(
    "materias",
    function (collectionApi) {

      return collectionApi
        .getFilteredByGlob("./materias/**/*.md")
        .sort(function (a, b) {

          const dataA =
            a.data.dataPublicacao || "";

          const dataB =
            b.data.dataPublicacao || "";

          return String(dataB).localeCompare(
            String(dataA)
          );
        });
    }
  );


  // ==========================================
  // CONFIGURAÇÃO PRINCIPAL
  // ==========================================

  return {

    dir: {

      // Executado a partir da pasta MeuSite.
      input: ".",

      // Modelo visual das matérias.
      includes: "gerador-eleventy/_includes",

      // Saída separada do site publicado.
      output: "gerador-eleventy/_site"
    },

    templateFormats: ["md", "11ty.js"],

    markdownTemplateEngine: "liquid"
  };

};
