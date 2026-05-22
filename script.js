const defaultRecommendation = {
  category: "Technical Review Required",
  why:
    "The selected combination requires more process information before recommending a release agent, lubricant or metalworking fluid.",
  applications: "Custom die casting and machining applications.",
  nextStep:
    "Contact us with alloy, machine tonnage, part drawing, die temperature, current defect photos and existing lubricant information."
};

const recommendations = {
  aluminiumStructuralLargeTonnage: {
    category: "Structural Parts Low-Residue Release Agent",
    why:
      "Large aluminium structural castings require stable film formation across wide die surfaces, strong release performance, and controlled residue to support downstream cleaning or finishing.",
    applications:
      "Integrated die casting parts, battery tray structures, large body structural components.",
    nextStep:
      "Contact us with alloy grade, machine tonnage, die temperature range, part size, current dilution ratio and defect photos."
  },
  magnesium: {
    category: "Magnesium Alloy High-Cleanliness Release Agent",
    why:
      "Magnesium die casting requires controlled release, low residue and stable lubrication under high thermal load, especially for thin-wall and precision components.",
    applications:
      "Magnesium housings, electronic components, lightweight automotive parts, smartphone magnesium back covers.",
    nextStep:
      "Contact us with part weight, wall thickness, machine tonnage and current sticking, staining or surface issue."
  },
  semiSolid: {
    category: "Semi-solid Aluminium / Magnesium Casting Release Agent",
    why:
      "Semi-solid casting applications require clean release, stable thermal behavior and low contamination to support dense, high-integrity parts with low porosity and precision surface quality.",
    applications:
      "Hydraulic brake valves, wheels, brake master cylinders, oil filter housings, door pillars, steering control arms, engine brackets, cylinder blocks and support structures.",
    nextStep:
      "Contact us with the semi-solid process route, alloy, part type, die temperature, slurry preparation method and surface quality requirement."
  },
  siliconeFree: {
    category: "Silicone-free Low-Residue Release Agent",
    why:
      "Silicone-free release technology helps reduce surface contamination risks when painting, bonding, coating or other post-casting surface treatments are required.",
    applications:
      "Electrical components, painted aluminium castings, coated structural parts, bonded assemblies.",
    nextStep:
      "Contact us with downstream process details, surface cleanliness requirements and current residue issue."
  },
  plunger: {
    category: "Low-Smoke Plunger Lubricant",
    why:
      "Plunger lubricants are designed to protect shot sleeves and plunger tips while supporting stable shot performance and reduced smoke in the foundry.",
    applications:
      "High-pressure die casting machines, shot sleeve systems, plunger tips and automated lubrication systems.",
    nextStep:
      "Contact us with shot sleeve diameter, shot frequency, current lubricant type and wear problem."
  },
  lowResidue: {
    category: "Low Residue Die Release Agent",
    why:
      "Low-residue release agents help reduce build-up, staining and residue on castings and die surfaces, supporting cleaner downstream processing.",
    applications:
      "High surface quality castings, painted parts, electrical housings, heat sinks and precision aluminium components.",
    nextStep:
      "Contact us with current release agent dilution, spray time, die temperature and residue location."
  },
  cuttingFluid: {
    category: "Metalworking Fluid / Cutting Fluid",
    why:
      "CNC machining requires stable cooling, lubrication, corrosion protection and chip removal depending on the metal and machining process.",
    applications:
      "Aluminium machining, steel machining, tapping, drilling, milling and grinding.",
    nextStep:
      "Contact us with material, operation type, tool material, water hardness and current fluid issue."
  }
};

function isLargeTonnage(tonnage) {
  return tonnage === "2000T-7000T" || tonnage === "Above 7000T";
}

function getRecommendation(selection) {
  const { process, alloy, tonnage, partType, problem } = selection;

  // Priority 1: semi-solid process is the most specialized route.
  if (process === "Semi-solid Die Casting") {
    return recommendations.semiSolid;
  }

  // Priority 2: magnesium process or material.
  if (process === "Magnesium Die Casting" || alloy === "Magnesium") {
    return recommendations.magnesium;
  }

  // Priority 3: plunger life issue.
  if (problem === "Short Plunger Life") {
    return recommendations.plunger;
  }

  // Priority 4: downstream finishing compatibility.
  if (problem === "Painting / Coating / Bonding Compatibility") {
    return recommendations.siliconeFree;
  }

  // Priority 5: residue issue.
  if (problem === "High Residue") {
    return recommendations.lowResidue;
  }

  // Priority 6: large aluminium structural die casting.
  if (
    process === "High Pressure Die Casting" &&
    alloy === "Aluminium" &&
    isLargeTonnage(tonnage) &&
    partType === "Structural Part"
  ) {
    return recommendations.aluminiumStructuralLargeTonnage;
  }

  // Priority 7: machining route.
  if (process === "CNC Machining") {
    return recommendations.cuttingFluid;
  }

  // Priority 8: default technical review.
  return defaultRecommendation;
}

function getCurrentSelection(form) {
  const formData = new FormData(form);

  return {
    process: formData.get("process"),
    alloy: formData.get("alloy"),
    tonnage: formData.get("tonnage"),
    partType: formData.get("partType"),
    problem: formData.get("problem")
  };
}

function renderRecommendation(result) {
  document.querySelector("#resultCategory").textContent = result.category;
  document.querySelector("#resultWhy").textContent = result.why;
  document.querySelector("#resultApplications").textContent = result.applications;
  document.querySelector("#resultNextStep").textContent = result.nextStep;
}

function initializeSelector() {
  const form = document.querySelector("#productSelector");

  if (!form) {
    return;
  }

  renderRecommendation(defaultRecommendation);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selection = getCurrentSelection(form);
    renderRecommendation(getRecommendation(selection));
  });
}

function initializeNavigation() {
  const body = document.body;
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const navItems = document.querySelectorAll(".nav-item");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", String(!isOpen));
      body.classList.toggle("menu-open", !isOpen);
    });
  }

  navItems.forEach((item) => {
    const trigger = item.querySelector(".nav-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      navItems.forEach((otherItem) => {
        otherItem.classList.remove("is-open");
        const otherTrigger = otherItem.querySelector(".nav-trigger");
        if (otherTrigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".site-nav") || event.target.closest(".mobile-menu-toggle")) {
      return;
    }

    navItems.forEach((item) => {
      item.classList.remove("is-open");
      const trigger = item.querySelector(".nav-trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      if (mobileToggle) {
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function initializeRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const newsFeeds = {
  "die-casting": {
    label: "Die Casting",
    url:
      "https://news.google.com/rss/search?q=die%20casting%20when%3A7d&hl=en-US&gl=US&ceid=US:en"
  },
  hpdc: {
    label: "HPDC",
    url:
      "https://news.google.com/rss/search?q=high%20pressure%20die%20casting%20when%3A7d&hl=en-US&gl=US&ceid=US:en"
  },
  foundry: {
    label: "Foundry Technology",
    url:
      "https://news.google.com/rss/search?q=foundry%20technology%20die%20casting%20when%3A7d&hl=en-US&gl=US&ceid=US:en"
  }
};

function buildNewsFallback(list, status, feed) {
  list.innerHTML = "";

  const item = document.createElement("article");
  item.className = "news-item";

  const label = document.createElement("span");
  label.textContent = "Live search";

  const title = document.createElement("h3");
  title.textContent = `${feed.label} news search is ready`;

  const body = document.createElement("p");
  body.textContent =
    "The live feed could not be loaded in this browser. Open the global news search to see the latest results.";

  const link = document.createElement("a");
  link.href = feed.url.replace("/rss/search", "/search");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open global news ->";

  item.append(label, title, body, link);
  list.append(item);
  status.textContent = "Live feed unavailable here. Use the global news link for real-time results.";
}

function renderNewsItems(list, items) {
  list.innerHTML = "";

  items.slice(0, 6).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "news-item";

    const source = document.createElement("span");
    source.textContent = entry.author || "Global news";

    const title = document.createElement("h3");
    title.textContent = entry.title || "Die casting news update";

    const published = document.createElement("p");
    published.textContent = entry.pubDate
      ? `Published: ${new Date(entry.pubDate).toLocaleDateString()}`
      : "Latest industry update";

    const link = document.createElement("a");
    link.href = entry.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Read article ->";

    item.append(source, title, published, link);
    list.append(item);
  });
}

async function loadNews(feedKey = "die-casting") {
  const list = document.querySelector("#liveNewsList");
  const status = document.querySelector("#newsStatus");
  const feed = newsFeeds[feedKey] || newsFeeds["die-casting"];

  if (!list || !status) {
    return;
  }

  status.textContent = `Loading latest ${feed.label} news...`;

  try {
    const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("News feed request failed");
    }

    const data = await response.json();

    if (!data.items || !data.items.length) {
      throw new Error("No news items returned");
    }

    renderNewsItems(list, data.items);
    status.textContent = `Showing latest global ${feed.label} news from public news search.`;
  } catch (error) {
    buildNewsFallback(list, status, feed);
  }
}

function ensureNewsWindowStyles() {
  if (document.querySelector("#newsWindowStyles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "newsWindowStyles";
  style.textContent = `
    .news-window-section{background:#fff;padding-top:clamp(42px,6vw,72px);padding-bottom:clamp(42px,6vw,72px)}
    .news-window{border:1px solid var(--line,#d7e1e8);background:linear-gradient(135deg,rgba(0,111,191,.055),transparent 42%),#fff;box-shadow:var(--shadow-soft,0 18px 45px rgba(6,24,38,.11));padding:clamp(22px,4vw,36px)}
    .news-window__header{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:start;border-bottom:1px solid var(--line,#d7e1e8);padding-bottom:22px}
    .news-window__header h2{margin:0;color:var(--navy-950,#061826);font-size:clamp(28px,3vw,40px);line-height:1.12}
    .news-window__header p{max-width:760px;margin:12px 0 0;color:var(--text-muted,#607381)}
    .news-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}
    .news-window .button-secondary{border-color:var(--line-strong,#b9c9d4);background:#fff;color:var(--navy-950,#061826)}
    .news-source-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
    .news-source{border:1px solid var(--line,#d7e1e8);background:#fff;color:var(--text-muted,#607381);cursor:pointer;font-size:13px;font-weight:800;padding:10px 13px;transition:border-color .18s ease,color .18s ease,background .18s ease}
    .news-source:hover,.news-source:focus-visible,.news-source.is-active{border-color:rgba(0,169,157,.55);background:#eef8f8;color:var(--navy-950,#061826)}
    .news-status{margin-top:16px;color:var(--text-muted,#607381);font-size:13px}
    .news-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:18px}
    .news-item{position:relative;min-height:220px;border:1px solid var(--line,#d7e1e8);background:#fff;padding:20px;transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}
    .news-item:before{position:absolute;top:0;right:0;left:0;height:3px;background:linear-gradient(90deg,var(--blue-600,#006fbf),var(--teal-500,#00a99d));content:"";opacity:0;transition:opacity .18s ease}
    .news-item:hover{border-color:rgba(0,169,157,.45);box-shadow:var(--shadow-card,0 16px 34px rgba(6,24,38,.1));transform:translateY(-3px)}
    .news-item:hover:before{opacity:1}
    .news-item span{color:var(--blue-600,#006fbf);font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
    .news-item h3{margin:14px 0 0;color:var(--navy-950,#061826);font-size:19px;line-height:1.25}
    .news-item p{margin:12px 0 0;color:var(--text-muted,#607381);font-size:14px}
    .news-item a{display:inline-flex;gap:8px;margin-top:18px;color:var(--blue-600,#006fbf);font-size:14px;font-weight:800}
    @media(max-width:1280px){.news-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:760px){.news-window__header,.news-list{grid-template-columns:1fr}.news-actions{justify-content:stretch}}
  `;
  document.head.append(style);
}

function ensureNewsWindowMarkup() {
  if (document.querySelector("#global-news")) {
    return;
  }

  const hero = document.querySelector(".hero");

  if (!hero) {
    return;
  }

  const section = document.createElement("section");
  section.className = "section news-window-section";
  section.id = "global-news";
  section.innerHTML = `
    <div class="news-window reveal" aria-live="polite">
      <div class="news-window__header">
        <div>
          <p class="section-label">Global Die Casting News</p>
          <h2>Live industry news window</h2>
          <p>A front-end news window for global die casting, high-pressure die casting, foundry technology and advanced manufacturing updates.</p>
        </div>
        <div class="news-actions">
          <button class="button button-primary news-refresh" type="button" id="refreshNews">Refresh News <span aria-hidden="true">-></span></button>
          <a class="button button-secondary news-link" href="https://news.google.com/search?q=die%20casting%20OR%20high%20pressure%20die%20casting%20when%3A7d&hl=en-US&gl=US&ceid=US%3Aen" target="_blank" rel="noopener noreferrer">Open Global News <span aria-hidden="true">-></span></a>
        </div>
      </div>
      <div class="news-source-tabs" aria-label="News topics">
        <button type="button" class="news-source is-active" data-feed="die-casting">Die Casting</button>
        <button type="button" class="news-source" data-feed="hpdc">HPDC</button>
        <button type="button" class="news-source" data-feed="foundry">Foundry Technology</button>
      </div>
      <div class="news-status" id="newsStatus">Loading global die casting news...</div>
      <div class="news-list" id="liveNewsList">
        <article class="news-item news-item--placeholder">
          <span>Live feed</span>
          <h3>Global die casting news will appear here when the public feed is available.</h3>
          <p>If the live feed is blocked by browser or network policy, use the global news button to open the latest search results.</p>
        </article>
      </div>
    </div>
  `;
  hero.insertAdjacentElement("afterend", section);
}

function initializeNewsWindow() {
  ensureNewsWindowStyles();
  ensureNewsWindowMarkup();

  const refreshButton = document.querySelector("#refreshNews");
  const sourceButtons = document.querySelectorAll(".news-source");
  let activeFeed = "die-casting";

  if (!document.querySelector("#liveNewsList")) {
    return;
  }

  sourceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sourceButtons.forEach((sourceButton) => sourceButton.classList.remove("is-active"));
      button.classList.add("is-active");
      activeFeed = button.dataset.feed || "die-casting";
      loadNews(activeFeed);
    });
  });

  if (refreshButton) {
    refreshButton.addEventListener("click", () => loadNews(activeFeed));
  }

  loadNews(activeFeed);
}

if (typeof document !== "undefined") {
  initializeSelector();
  initializeNavigation();
  initializeRevealAnimations();
  initializeNewsWindow();
}

if (typeof window !== "undefined") {
  window.getRecommendation = getRecommendation;
}
