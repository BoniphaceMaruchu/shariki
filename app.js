const logicStages = [
  {
    kicker: "THE STARTING CONDITION",
    title: "An important need remains unmet",
    description: "People may want a product or service but cannot obtain it reliably because it costs too much, is too complicated, or is not available where they live."
  },
  {
    kicker: "THE BUSINESS RESPONSE",
    title: "A different model expands access",
    description: "An entrepreneur changes the product, price or way it reaches people so that more customers can use it. The idea must work commercially as well as serve a real need."
  },
  {
    kicker: "THE GROWTH OPPORTUNITY",
    title: "New customers can support scale",
    description: "A larger market can give the business room to grow. Serving it well may require stronger operations, a capable team, distribution and suitable capital."
  },
  {
    kicker: "THE LONGER-TERM POSSIBILITY",
    title: "Growth can create wider gains",
    description: "If the model succeeds, jobs, suppliers, skills and local economic activity can grow around it. These effects must be observed over time rather than assumed."
  }
];

const logicTabs = [...document.querySelectorAll(".logic-tab")];
const logicPanel = document.getElementById("logic-panel");
function selectLogic(index, moveFocus = false) {
  const stage = logicStages[index];
  if (!stage || !logicPanel) return;
  logicTabs.forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById("logic-kicker").textContent = stage.kicker;
  document.getElementById("logic-heading").textContent = stage.title;
  document.getElementById("logic-description").textContent = stage.description;
  document.getElementById("logic-symbol").textContent = String(index + 1).padStart(2, "0");
  logicPanel.setAttribute("aria-labelledby", logicTabs[index].id);
  if (moveFocus) logicTabs[index].focus();
}
logicTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectLogic(index));
  tab.addEventListener("keydown", event => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % logicTabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + logicTabs.length) % logicTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = logicTabs.length - 1;
    else return;
    event.preventDefault();
    selectLogic(next, true);
  });
});

document.querySelectorAll(".model-more").forEach(button => {
  button.addEventListener("click", () => {
    const detail = document.getElementById(button.getAttribute("aria-controls"));
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    detail.hidden = expanded;
    button.querySelector("span").textContent = expanded ? "+" : "−";
  });
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
if (menuButton && nav) {
  function closeMenu() {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia("(min-width: 821px)").addEventListener("change", event => {
    if (event.matches) closeMenu();
  });
}

const progress = document.getElementById("reading-progress");
let ticking = false;
function updateReadingProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = available > 0 ? Math.max(0, Math.min(1, window.scrollY / available)) : 0;
  progress.style.width = (fraction * 100).toFixed(2) + "%";
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateReadingProgress);
    ticking = true;
  }
}, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    navLinks.forEach(link => {
      const active = link.getAttribute("href") === "#" + visible[0].target.id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, .1, .5] });
  observedSections.forEach(section => sectionObserver.observe(section));
}
