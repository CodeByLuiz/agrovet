// ============ CONFIGURAÇÃO (usada em todas as páginas) ============
// Troque pelo WhatsApp da empresa: código do país + DDD + número, só dígitos.
const WHATSAPP_EMPRESA = "5516999999999";

// Link do telefone no rodapé
document.getElementById("link-telefone").href = "tel:+" + WHATSAPP_EMPRESA;

// ============ VACA ANIMADA ============
const vaca        = document.getElementById("vaca");
const desenhoVaca = vaca.querySelector("svg");
let ultimaPosicao = window.scrollY;
let timerParada;
let aguardandoFrame = false;

function moverVaca() {
  // progresso: 0 no topo da página, 1 no final
  const rolagemMaxima = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = rolagemMaxima > 0 ? window.scrollY / rolagemMaxima : 0;
  const espacoLivre = window.innerWidth - vaca.offsetWidth;
  vaca.style.transform = "translateX(" + (progresso * espacoLivre) + "px)";

  // Se a página se moveu, a vaca anda; ao parar de rolar, ela para
  if (window.scrollY !== ultimaPosicao) {
    desenhoVaca.classList.toggle("esquerda", window.scrollY < ultimaPosicao);
    vaca.classList.add("andando");
    clearTimeout(timerParada);
    timerParada = setTimeout(function () { vaca.classList.remove("andando"); }, 150);
  }
  ultimaPosicao = window.scrollY;
  aguardandoFrame = false;
}

// requestAnimationFrame evita recalcular a cada pixel rolado
window.addEventListener("scroll", function () {
  if (!aguardandoFrame) {
    aguardandoFrame = true;
    requestAnimationFrame(moverVaca);
  }
}, { passive: true });
window.addEventListener("resize", moverVaca);
moverVaca();
