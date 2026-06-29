document.addEventListener("DOMContentLoaded", () => {
  const botaoMenu = document.querySelector(".menu-botao");
  const menu = document.querySelector(".menu");

  if (!botaoMenu || !menu) return;

  const fecharMenu = () => {
    menu.classList.remove("ativo");
    document.body.classList.remove("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.textContent = "☰";
  };

  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("ativo");
    document.body.classList.toggle("menu-aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.textContent = aberto ? "✕" : "☰";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") fecharMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) fecharMenu();
  });
});
