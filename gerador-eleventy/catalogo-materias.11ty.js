
/* ==========================================
   INFERNO ESCARLATE
   GERADOR AUTOMÁTICO DO CATÁLOGO
========================================== */

module.exports = class {

  data() {
    return {
      permalink: "dados/materias.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {

    // Apenas matérias aprovadas entram no catálogo.
    const materias = data.collections.materias
      .filter((materia) => {
        return materia.data.publicado === true;
      })
      .map((materia) => {

        return {
          titulo: materia.data.title || "",
          resumo: materia.data.description || "",
          imagem: materia.data.imagem || "",
          alt: materia.data.imagemAlt || "",
          url: materia.url || "",
          categoriaTexto: materia.data.categoriaTexto || "",
          categorias: materia.data.categorias || [],
          coluna: materia.data.coluna || "",
          autor: materia.data.autor || "Inferno Escarlate",
          data: materia.data.dataPublicacao || "",
          destaque: materia.data.destaque === true
        };

      });

    return JSON.stringify(materias, null, 2);

  }

};
