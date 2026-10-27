const riduciMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// 1. TEMA CHIARO / SCURO
const radice = document.documentElement;
const bottoneTema = document.getElementById("tema");

function applicaTema(tema) {
  radice.dataset.tema = tema;
  bottoneTema.textContent = tema === "scuro" ? "☀️" : "🌙";
  bottoneTema.setAttribute(
    "aria-label",
    tema === "scuro" ? "Passa al tema chiaro" : "Passa al tema scuro",
  );
}

applicaTema(radice.dataset.tema || "chiaro");

bottoneTema.addEventListener("click", () => {
  const nuovo = radice.dataset.tema === "scuro" ? "chiaro" : "scuro";
  applicaTema(nuovo);
  try {
    localStorage.setItem("tema", nuovo); // ricorda la scelta
  } catch (errore) {}
});

// 2. BARRA DI AVANZAMENTO
const barra = document.querySelector(".progresso");

function aggiornaBarra() {
  const totale = document.documentElement.scrollHeight - window.innerHeight;
  barra.style.width = (totale > 0 ? (window.scrollY / totale) * 100 : 0) + "%";
}

window.addEventListener("scroll", aggiornaBarra);
aggiornaBarra();

// 3. COMPARSA DEGLI ELEMENTI + CONTATORI
function contaFinoA(elemento, valore) {
  const durata = 1200;
  const inizio = performance.now();

  function passo(adesso) {
    const progresso = Math.min((adesso - inizio) / durata, 1);
    elemento.textContent = Math.round(valore * progresso);
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

const numeri = document.querySelectorAll(".numero");

if (!riduciMovimento && "IntersectionObserver" in window) {
  radice.classList.add("js");
  numeri.forEach((n) => (n.textContent = "0"));

  const osservatore = new IntersectionObserver(
    (voci) => {
      voci.forEach((voce) => {
        if (!voce.isIntersecting) return;
        voce.target.classList.add("visibile");
        voce.target.querySelectorAll(".numero").forEach((n) => {
          contaFinoA(n, Number(n.dataset.valore));
        });
        osservatore.unobserve(voce.target);
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".row, .card, .numeri, .cosaCerco")
    .forEach((el) => osservatore.observe(el));
}

// 4. COPIA EMAIL
const bottoneCopia = document.getElementById("copia");
const email = document.getElementById("indirizzo").textContent.trim();

bottoneCopia.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    bottoneCopia.textContent = "Copiato!";
  } catch (errore) {
    bottoneCopia.textContent = "Non riuscito";
  }
  setTimeout(() => (bottoneCopia.textContent = "Copia"), 1800);
});

// 5. TESTI SCRITTI LETTERA PER LETTERA
function scrivi(elemento, velocita, alTermine) {
  const testo = elemento.textContent.trim();

  elemento.setAttribute("aria-label", testo);
  elemento.textContent = "";
  elemento.classList.add("scrittura");

  let i = 0;
  const timer = setInterval(() => {
    i++;
    elemento.textContent = testo.slice(0, i);
    if (i === testo.length) {
      clearInterval(timer);
      elemento.classList.remove("scrittura");
      if (alTermine) alTermine();
    }
  }, velocita);
}

if (!riduciMovimento) {
  const nome = document.querySelector("h1");
  const ruolo = document.querySelector(".sottotitolo b");

  ruolo.style.visibility = "hidden";

  scrivi(nome, 90, () => {
    ruolo.style.visibility = "visible";
    scrivi(ruolo, 55);
  });
}