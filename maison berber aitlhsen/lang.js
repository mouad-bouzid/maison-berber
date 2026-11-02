/* EN / FR switcher – same engine, UI and storage key ("mb-lang") as the home page.
   Put this file in /js and load it before the GSAP scripts. */
(() => {
  "use strict";
  if (window.__mbLangLoaded) return;
  window.__mbLangLoaded = true;

  const T = {
    /* head */
    "Guest Reviews | Ourika Atlas Guide – Ourika Valley & Atlas Mountains Tours": "Avis des voyageurs | Ourika Atlas Guide – Excursions dans la vallée de l'Ourika et le Haut Atlas",
    "Read guest reviews of Ourika Atlas Guide. Discover authentic Ourika Valley guided tours, Setti Fatma waterfalls, Marrakech day trips and Atlas Mountains trekking with local guide Mohamed Ait Lhsen.": "Lisez les avis des voyageurs sur Ourika Atlas Guide. Découvrez des excursions guidées authentiques dans la vallée de l'Ourika, les cascades de Setti Fatma, des excursions depuis Marrakech et des treks dans le Haut Atlas avec le guide local Mohamed Ait Lhsen.",

    /* header / nav */
    "Skip to content": "Aller au contenu",
    "Open menu": "Ouvrir le menu",
    "Close menu": "Fermer le menu",
    "Maison Berber Ait Lhsen, home": "Maison Berber Ait Lhsen, accueil",
    "Main": "Principal",
    "Home": "Accueil",
    "Day Trips": "Excursions",
    "Activities": "Activités",
    "About Us": "À propos",
    "Reviews": "Avis",
    "Contact": "Contact",
    "Plan a trip": "Planifier un voyage",
    "Plan a Trip": "Planifier un voyage",

    /* hero */
    "Guest experiences · Ourika Valley · High Atlas": "Expériences des voyageurs · Vallée de l'Ourika · Haut Atlas",
    "Reviews & Guest Experiences": "Avis & expériences des voyageurs",
    "The best days in the Atlas are built on trust, local knowledge and genuine human connection. Here is what guests say after exploring the Ourika Valley, Setti Fatma waterfalls and Berber villages with Ourika Atlas Guide.": "Les plus belles journées dans l'Atlas reposent sur la confiance, la connaissance locale et une vraie relation humaine. Voici ce que disent les voyageurs après avoir exploré la vallée de l'Ourika, les cascades de Setti Fatma et les villages berbères avec Ourika Atlas Guide.",
    "Explore Day Trips": "Découvrir les excursions",
    "Setti Fatma waterfalls and green valley in the Ourika Valley, High Atlas": "Cascades de Setti Fatma et vallée verdoyante dans la vallée de l'Ourika, Haut Atlas",

    /* overview */
    "Guest rating placeholder": "Note des voyageurs (exemple)",
    "We Value Your Voice! Write a reviews and Help Us Serve You Better.": "Votre avis compte ! Écrivez un avis et aidez-nous à mieux vous servir.",
    "Trusted guest feedback": "Avis de voyageurs de confiance",
    "We only display ratings and review counts when they are publicly available and verified. Check back soon, or read the guest stories below.": "Nous n'affichons les notes et le nombre d'avis que lorsqu'ils sont publics et vérifiés. Revenez bientôt, ou lisez les témoignages ci-dessous.",
    "Google Reviews": "Avis Google",
    "Tripadvisor": "Tripadvisor",
    "Verified guests": "Voyageurs vérifiés",
    "Share your experience": "Partagez votre expérience",

    /* reviews */
    "Guest reviews": "Avis des voyageurs",
    "Real stories from the Atlas": "De vraies histoires de l'Atlas",
    "Feedback from guests who explored the Ourika Valley, hiked to Setti Fatma and discovered Berber village life with a local guide.": "Les retours de voyageurs qui ont exploré la vallée de l'Ourika, marché jusqu'à Setti Fatma et découvert la vie des villages berbères avec un guide local.",
    "Browse Ourika Valley tours": "Voir les excursions de la vallée de l'Ourika",
    "Example structure.": "Structure d'exemple.",
    "The reviews below are placeholder examples, not real guest testimonials. Replace them with verified reviews from Google, Tripadvisor or direct guest feedback before publishing.": "Les avis ci-dessous sont des exemples, pas de vrais témoignages. Remplacez-les par des avis vérifiés de Google, Tripadvisor ou des retours directs avant de publier.",
    "Filter reviews by trip": "Filtrer les avis par excursion",
    "All experiences": "Toutes les expériences",
    "Ourika Valley": "Vallée de l'Ourika",
    "Setti Fatma": "Setti Fatma",
    "Atlas trekking": "Trek dans l'Atlas",
    "Guest name": "Nom du voyageur",
    "Ourika Valley guided tour": "Excursion guidée dans la vallée de l'Ourika",
    "Setti Fatma waterfalls walk": "Balade aux cascades de Setti Fatma",
    "Atlas Mountains trekking": "Trek dans les montagnes de l'Atlas",
    "Marrakech day trip": "Excursion d'une journée depuis Marrakech",
    "5 out of 5 stars": "5 étoiles sur 5",
    "Replace this paragraph with the guest's own words about their Ourika Valley excursion, the scenery, the guide and the overall experience.": "Remplacez ce paragraphe par les propres mots du voyageur sur son excursion dans la vallée de l'Ourika, les paysages, le guide et l'expérience globale.",
    "Replace this paragraph with the guest's own words about the Setti Fatma waterfalls, the hike, the riverside lunch and the local guidance.": "Remplacez ce paragraphe par les propres mots du voyageur sur les cascades de Setti Fatma, la randonnée, le déjeuner au bord de la rivière et l'accompagnement local.",
    "Replace this paragraph with the guest's own words about the mountain trek, the Berber village visit, the local culture and the guide's knowledge.": "Remplacez ce paragraphe par les propres mots du voyageur sur le trek en montagne, la visite du village berbère, la culture locale et les connaissances du guide.",
    "Replace this paragraph with the guest's own words about the day trip from Marrakech, the transport, the guide and the overall value of the experience.": "Remplacez ce paragraphe par les propres mots du voyageur sur l'excursion depuis Marrakech, le transport, le guide et le rapport qualité-prix de l'expérience.",
    "Google": "Google",
    "Direct guest": "Voyageur direct",
    "Date": "Date",

    /* gallery */
    "Guest experiences": "Expériences des voyageurs",
    "Moments from the Ourika Valley & Atlas Mountains": "Moments dans la vallée de l'Ourika et les montagnes de l'Atlas",
    "Authentic photos from guided excursions, village walks and mountain days with Ourika Atlas Guide.": "Photos authentiques d'excursions guidées, de balades au village et de journées en montagne avec Ourika Atlas Guide.",
    "See all activities": "Voir toutes les activités",
    "Guest experience photo gallery": "Galerie photo des expériences des voyageurs",
    "Woman shaping clay at a pottery wheel in the Ourika Valley": "Femme façonnant l'argile au tour de potier dans la vallée de l'Ourika",
    "Traditional Berber village in the High Atlas mountains": "Village berbère traditionnel dans les montagnes du Haut Atlas",
    "Green terraced fields around an Atlas village": "Champs verts en terrasses autour d'un village de l'Atlas",
    "Guests walking a red mountain trail towards Tizi N'Oucheg": "Voyageurs marchant sur un sentier de montagne rouge vers Tizi N'Oucheg",
    "Guests sharing a traditional meal indoors in a Berber village": "Voyageurs partageant un repas traditionnel dans un village berbère",
    "Panoramic view of a High Atlas village and valley": "Vue panoramique d'un village et d'une vallée du Haut Atlas",

    /* CTA */
    "Your Atlas adventure": "Votre aventure dans l'Atlas",
    "Discover the Ourika Valley with a local guide": "Découvrez la vallée de l'Ourika avec un guide local",
    "Join a private guided tour, hike to Setti Fatma waterfalls, or explore Berber villages on an Atlas Mountains trek from Marrakech.": "Rejoignez une excursion guidée privée, marchez jusqu'aux cascades de Setti Fatma ou explorez des villages berbères lors d'un trek dans l'Atlas depuis Marrakech.",
    "WhatsApp Mohamed": "WhatsApp Mohamed",

    /* footer + floating button */
    "Day trips & village experiences from Marrakech": "Excursions & expériences villageoises depuis Marrakech",
    "Local guide Mohamed maison berber, Tizi N'Oucheg and the High Atlas, Morocco.": "Guide local Mohamed maison berber, Tizi N'Oucheg et le Haut Atlas, Maroc.",
    "Explore": "Explorer",
    "FAQ": "FAQ",
    "Company": "Entreprise",
    "53 Derb el Cadi, Marrakech 40030, Morocco": "53 Derb el Cadi, Marrakech 40030, Maroc",
    "Maison Berber Ait Lhsen. All rights reserved.": "Maison Berber Ait Lhsen. Tous droits réservés.",
    "Marrakech · Tizi N'Oucheg · High Atlas · Ourika Valley": "Marrakech · Tizi N'Oucheg · Haut Atlas · Vallée de l'Ourika",
    "Need help?": "Besoin d'aide ?",
    "Need help? Contact Maison Berber Ait Lhsen on WhatsApp": "Besoin d'aide ? Contactez Maison Berber Ait Lhsen sur WhatsApp",
    "Maison Berber Ait Lhsen on WhatsApp": "Maison Berber Ait Lhsen sur WhatsApp",
    "Mohamed on Instagram": "Mohamed sur Instagram",
    "Contact address on Google Maps": "Adresse de contact sur Google Maps"
  };

  const norm = (s) => s.replace(/[\u2018\u2019\u2032]/g, "'").replace(/\s+/g, " ").trim();
  const MAP = new Map(Object.entries(T).map(([k, v]) => [norm(k), v]));
  const PATTERNS = [[/^(\d+)\s+Reviews?$/, (m) => m[1] + " avis"]];
  const lookup = (core) => {
    if (!core) return null;
    const k = norm(core);
    if (MAP.has(k)) return MAP.get(k);
    for (const [re, fn] of PATTERNS) { const m = k.match(re); if (m) return fn(m); }
    return null;
  };

  const ATTRS = ["alt", "aria-label", "title", "placeholder"];
  const origText = new WeakMap(), origAttrs = new WeakMap();
  let lang = "en";

  const walk = (root, fn) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentNode && n.parentNode.nodeName;
      if (p === "SCRIPT" || p === "STYLE" || p === "NOSCRIPT") continue;
      fn(n);
    }
  };
  const trText = (n) => {
    const s = n.nodeValue, m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const t = lookup(m[2]);
    if (t !== null && t !== m[2]) { if (!origText.has(n)) origText.set(n, s); n.nodeValue = m[1] + t + m[3]; }
  };
  const trAttrs = (el) => {
    ATTRS.forEach((a) => {
      if (!el.hasAttribute || !el.hasAttribute(a)) return;
      const cur = el.getAttribute(a), t = lookup(cur);
      if (t !== null && t !== cur) {
        const bag = origAttrs.get(el) || {};
        if (!(a in bag)) bag[a] = cur;
        origAttrs.set(el, bag);
        el.setAttribute(a, t);
      }
    });
  };
  const allAttrEls = (root) => [root, ...root.querySelectorAll("[alt],[aria-label],[title],[placeholder]")];

  const setMeta = (l) => {
    const title = document.querySelector("title");
    if (title) {
      if (!title.dataset.en) title.dataset.en = title.textContent;
      title.textContent = l === "fr" ? (lookup(title.dataset.en) || title.dataset.en) : title.dataset.en;
    }
    const md = document.querySelector('meta[name="description"]');
    if (md) {
      if (!md.dataset.en) md.dataset.en = md.getAttribute("content") || "";
      md.setAttribute("content", l === "fr" ? (lookup(md.dataset.en) || md.dataset.en) : md.dataset.en);
    }
    document.documentElement.lang = l;
  };

  const apply = (l) => {
    lang = l;
    walk(document.body, (n) => {
      if (l === "fr") trText(n);
      else if (origText.has(n)) { n.nodeValue = origText.get(n); origText.delete(n); }
    });
    allAttrEls(document.body).forEach((el) => {
      if (l === "fr") trAttrs(el);
      else { const b = origAttrs.get(el); if (b) { Object.keys(b).forEach((a) => el.setAttribute(a, b[a])); origAttrs.delete(el); } }
    });
    setMeta(l);
    markButtons();
  };

  /* keep FR while other scripts (count-up, title animation) rewrite text */
  const observer = new MutationObserver((muts) => {
    if (lang !== "fr") return;
    muts.forEach((m) => {
      if (m.type === "characterData") trText(m.target);
      else if (m.type === "attributes") trAttrs(m.target);
      else m.addedNodes.forEach((node) => {
        if (node.nodeType === 3) trText(node);
        else if (node.nodeType === 1) { walk(node, trText); allAttrEls(node).forEach(trAttrs); }
      });
    });
  });

  /* UI */
  const btn = {};
  const markButtons = () => ["en", "fr"].forEach((k) => btn[k] && btn[k].setAttribute("aria-pressed", String(lang === k)));
  const build = () => {
    if (document.querySelector(".mb-lang")) return;
    const st = document.createElement("style");
    st.textContent = ".mb-lang{position:fixed;top:92px;right:16px;z-index:9999;display:flex;gap:4px;padding:5px;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.18)}"
      + ".mb-lang button{width:34px;height:34px;border:0;border-radius:50%;background:transparent;font-size:19px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0;transition:background .2s,transform .2s}"
      + ".mb-lang button:hover{background:rgba(0,0,0,.08);transform:scale(1.08)}"
      + '.mb-lang button[aria-pressed="true"]{background:rgba(238,141,30,.22);box-shadow:inset 0 0 0 1.5px #EE8D1E}'
      + ".mb-lang button:focus-visible{outline:2px solid #211B1C;outline-offset:2px}"
      + "@media(max-width:600px){.mb-lang{top:auto;bottom:82px;right:12px}}";
    document.head.appendChild(st);
    const wrap = document.createElement("div");
    wrap.className = "mb-lang";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language");
    wrap.innerHTML = '<button type="button" data-lang="en" aria-label="English" title="English" aria-pressed="false">\uD83C\uDDEC\uD83C\uDDE7</button>'
      + '<button type="button" data-lang="fr" aria-label="Fran\u00e7ais" title="Fran\u00e7ais" aria-pressed="false">\uD83C\uDDEB\uD83C\uDDF7</button>';
    document.body.appendChild(wrap);
    ["en", "fr"].forEach((k) => {
      btn[k] = wrap.querySelector('[data-lang="' + k + '"]');
      btn[k].addEventListener("click", () => { try { localStorage.setItem("mb-lang", k); } catch (e) {} apply(k); });
    });
  };

  const boot = () => {
    build();
    observer.observe(document.body, { characterData: true, childList: true, attributes: true, attributeFilter: ["aria-label", "alt"], subtree: true });
    let saved = "en";
    try { saved = localStorage.getItem("mb-lang") || "en"; } catch (e) {}
    markButtons();
    if (saved === "fr") {
      lang = "fr"; markButtons();
      setTimeout(() => apply("fr"), 60);
      window.addEventListener("load", () => { if (lang === "fr") apply("fr"); });
    }
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
