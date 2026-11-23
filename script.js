const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
  siteNav?.classList.toggle("is-open", !isExpanded);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
    siteNav.classList.remove("is-open");
  });
});

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const quoteForm = document.querySelector("#quote-form");
quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(quoteForm instanceof HTMLFormElement) || !quoteForm.reportValidity()) return;

  const formData = new FormData(quoteForm);
  const name = String(formData.get("name") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = [
    "Olá! Vim pelo site da Contconvicta e gostaria de conversar com a equipe.",
    `Meu nome é ${name}.`,
    business ? `Minha empresa é ${business}.` : "",
    `Tenho interesse em: ${service}.`,
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/5561996098180?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

const shareButton = document.querySelector("#share-button");
const shareStatus = document.querySelector("#share-status");
shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "Conheça a Contconvicta Contabilidade.",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      if (shareStatus) shareStatus.textContent = "Link copiado para compartilhar.";
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    if (shareStatus) shareStatus.textContent = "Não foi possível compartilhar o link. Tente novamente.";
  }
});
