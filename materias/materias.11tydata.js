
/* ==========================================
   INFERNO ESCARLATE
   CONFIGURAÇÃO DAS MATÉRIAS
========================================== */

module.exports = {
  layout: "layouts/materia.liquid",

  eleventyComputed: {
    permalink: (data) => {

      // Rascunhos não geram páginas HTML.
      if (data.publicado !== true) {
        return false;
      }

      // Matérias aprovadas vão para /posts/.
      return `posts/${data.page.fileSlug}.html`;
    }
  }
};
