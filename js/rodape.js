
/* RODAPÉ GLOBAL - INFERNO ESCARLATE */

(async function () {
  const script = document.currentScript;
  const url = new URL("../rodape.html", script.src);

  async function carregarRodape() {
    const destino = document.getElementById("rodape-global");

    if (!destino) return;

    try {
      const resposta = await fetch(url);

      if (!resposta.ok) {
        throw new Error("Erro ao carregar o rodapé");
      }

      const html = await resposta.text();
      const template = document.createElement("template");

      template.innerHTML = html;

      template.content.querySelectorAll("a[href]").forEach(link => {
        const href = link.getAttribute("href");

        if (
          href &&
          !href.startsWith("#")
        ) {
          link.href = new URL(href, url).href;
        }
      });

      destino.replaceChildren(template.content.cloneNode(true));

    } catch (erro) {
      console.error("Erro no rodapé global:", erro);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", carregarRodape);
  } else {
    carregarRodape();
  }
})();
