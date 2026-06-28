const botaoMenu = document.querySelector(".menu-botao");
const menu = document.querySelector(".menu");

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("ativo");

    botaoMenu.textContent = aberto ? "✕" : "☰";
    botaoMenu.setAttribute("aria-expanded", aberto);
  });
}