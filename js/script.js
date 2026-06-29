

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", () => {
    const menuAberto = menu.classList.toggle("ativo");

    botaoMenu.setAttribute(
      "aria-expanded",
      menuAberto ? "true" : "false"
    );

    botaoMenu.textContent = menuAberto ? "✕" : "☰";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.textContent = "☰";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const botaoMenu = document.querySelector(".menu-botao");
  const menu = document.querySelector(".menu");

  if (!botaoMenu || !menu) {
    return;
  }

  menu.classList.remove("ativo");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.textContent = "☰";

  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("ativo");

    botaoMenu.setAttribute(
      "aria-expanded",
      aberto ? "true" : "false"
    );

    botaoMenu.textContent = aberto ? "✕" : "☰";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.textContent = "☰";
    });
  });
});