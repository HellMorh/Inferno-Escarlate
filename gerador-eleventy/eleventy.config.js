
/* ==========================================
   INFERNO ESCARLATE
   GERADOR DEFINITIVO DE MATÉRIAS
========================================== */

module.exports = function (eleventyConfig) {

  // Ignora o projeto antigo de testes.
  eleventyConfig.ignores.add("teste-eleventy/**");

  // Não transforma o README em página HTML.
  eleventyConfig.ignores.add("README.md");

  // Ignora arquivos gerados anteriormente.
  eleventyConfig.ignores.add("gerador-eleventy/_site/**");

  // Reúne as matérias escritas pelo Pages CMS.
  eleventyConfig.addCollection("materias", function (collectionApi) {

    return collectionApi
      .getFilteredByGlob("./materias/**/*.md")
      .sort(function (a, b) {

        const dataA = a.data.dataPublicacao || "";
        const dataB = b.data.dataPublicacao || "";

        return String(dataB).localeCompare(String(dataA));

      });

  });

  return {

    dir: {
      // Executado a partir da pasta principal MeuSite.
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
