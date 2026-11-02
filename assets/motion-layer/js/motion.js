/* Motion layer — single init path.
   GSAP + ScrollTrigger, Lenis (driven by the GSAP ticker), Blur Text, Light Rays, Star Border, count-up.
   Does not change any text or colour; everything is attached to existing markup. */
(() => {
  "use strict";
  if (typeof gsap === "undefined") return;                       // vendor files missing → site stays fully usable, just static

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasST = typeof ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const hero = $(".hero");
  const EASE = "power3.out";

  /* ---------------------------------------------------------------
     1. Lenis ↔ GSAP ticker (one rAF loop for everything)
  --------------------------------------------------------------- */
  let lenis = null;
  if (!reduce && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    if (hasST) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));           // GSAP time is in seconds, Lenis wants ms
    gsap.ticker.lagSmoothing(0);

    // inner horizontal scroller keeps native wheel/touch behaviour
    $$("[data-gal]").forEach((el) => el.setAttribute("data-lenis-prevent", ""));

    // mobile menu open → lock page scroll
    new MutationObserver(() => {
      document.body.classList.contains("menu-open") ? lenis.stop() : lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // in-page anchors go through Lenis (html{scroll-behavior:smooth} is neutralised by motion.css)
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = id === "#main" ? 0 : -((($(".header") || {}).offsetHeight || 72) + 8);
      lenis.scrollTo(target, { offset, duration: 1.2 });
      history.replaceState(null, "", id);
    });
  }

  /* ---------------------------------------------------------------
     2. Hero: Blur Text title + gentle intro + Light Rays
  --------------------------------------------------------------- */
  const title = $(".hero__title");
  const introRest = $$(".hero__eyebrow, .hero__sub, .hero__actions, .booking");

  if (title && !reduce) {
    const text = title.textContent.trim();
    title.setAttribute("aria-label", text);                      // screen readers get the original sentence
    title.textContent = "";
    text.split(/\s+/).forEach((w, i, arr) => {
      const s = document.createElement("span");
      s.className = "bt-word";
      s.setAttribute("aria-hidden", "true");
      s.textContent = w;
      title.appendChild(s);
      if (i < arr.length - 1) title.appendChild(document.createTextNode(" "));
    });
    const words = $$(".bt-word", title);
    gsap.set(words, { autoAlpha: 0, filter: "blur(12px)", y: 18 });
    gsap.set(introRest, { autoAlpha: 0, y: 16 });
    [title, ...introRest].forEach((el) => { el.style.animation = "none"; });   // cancel CSS failsafe
    gsap.set(title, { opacity: 1 });

    const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
    tl.to($(".hero__eyebrow"), { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(words, {
        autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.0, stagger: 0.09,
        onComplete: () => gsap.set(words, { clearProps: "filter,transform,opacity,visibility,willChange" })
      }, "-=0.45")
      .to($(".hero__sub"), { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5")
      .to($(".hero__actions"), { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.55")
      .to($(".booking"), {
        autoAlpha: 1, y: 0, duration: 0.9,
        onComplete: () => gsap.set(introRest, { clearProps: "visibility,transform" })   // keep inline opacity:1 so the CSS pre-hide never returns
      }, "-=0.7");
  }

  // Light Rays (static single frame under reduced motion)
  if (hero && typeof window.initLightRays === "function") {
    window.initLightRays(hero, { static: reduce });
  }

  /* ---------------------------------------------------------------
     3. Star Border on the primary CTA (decorative ring, pointer-events: none)
  --------------------------------------------------------------- */
  if (!reduce) {
    const cta = $(".hero .cta-orbit");
    if (cta) {
      cta.classList.add("star-border");
      const ring = document.createElement("span");
      ring.className = "star-border__ring";
      ring.setAttribute("aria-hidden", "true");
      ring.innerHTML = "<i></i><i></i>";
      cta.appendChild(ring);
    }
  }

  if (reduce || !hasST) return;                                   // below: scroll-driven motion only

  /* ---------------------------------------------------------------
     4. Scroll reveals (ScrollTrigger)
  --------------------------------------------------------------- */
  const clean = (els) => {
    gsap.set(els, { clearProps: "opacity,visibility,transform,clipPath" });
    els.forEach((el) => el.classList.remove("mo-anim"));
  };

  // groups that stagger together as they enter
  const reveal = (selector, { y = 28, stagger = 0.12, duration = 0.9, start = "top 88%" } = {}) => {
    const els = $$(selector);
    if (!els.length) return;
    els.forEach((el) => el.classList.add("mo-anim"));
    gsap.set(els, { autoAlpha: 0, y });
    ScrollTrigger.batch(els, {
      start, once: true,
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1, y: 0, duration, stagger, ease: EASE, overwrite: true,
        onComplete: () => clean(batch)
      })
    });
  };

  reveal(".statement__line", { y: 36, duration: 1.1 });
  reveal(".statement__sub");
  reveal(".shead");
  reveal(".split__copy > :not(.ledger)", { y: 22, stagger: 0.1 });
  reveal(".ledger div", { y: 16, stagger: 0.09 });
  reveal(".dtile", { y: 34, stagger: 0.12 });
  reveal(".promise", { y: 24, stagger: 0.14 });
  reveal(".tcard", { y: 36, stagger: 0.14 });
  reveal(".gal__track", { y: 24 });
  reveal(".quote-band figure", { y: 28, duration: 1.1 });
  reveal(".closer__card", { y: 32, duration: 1.0 });

  // guide portrait: soft mask reveal + settle
  const media = $(".split__media");
  if (media) {
    const img = $("img", media);
    media.classList.add("mo-anim");
    gsap.set(media, { clipPath: "inset(0% 0% 100% 0% round 28px)" });
    if (img) gsap.set(img, { scale: 1.15 });
    ScrollTrigger.create({
      trigger: media, start: "top 85%", once: true,
      onEnter: () => {
        gsap.to(media, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "power3.inOut", onComplete: () => clean([media]) });
        if (img) gsap.to(img, { scale: 1, duration: 1.8, ease: EASE, onComplete: () => gsap.set(img, { clearProps: "transform" }) });
      }
    });
  }

  // quote band photo: very light parallax
  const qImg = $(".quote-band__img");
  if (qImg) {
    gsap.fromTo(qImg, { scale: 1.12, yPercent: -4 }, {
      yPercent: 4, ease: "none",
      scrollTrigger: { trigger: ".quote-band", start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  /* ---------------------------------------------------------------
     5. Count-up — only for elements explicitly marked data-count
        <span data-count="120" data-count-suffix="+">120+</span>
        Put the real final value in the markup (it's what shows without JS).
  --------------------------------------------------------------- */
  $$("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    if (isNaN(end)) return;
    const prefix = el.dataset.countPrefix || "", suffix = el.dataset.countSuffix || "";
    const decimals = (String(el.dataset.count).split(".")[1] || "").length;
    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(state, {
        v: end, duration: 1.8, ease: "power2.out",
        onUpdate: () => { el.textContent = prefix + state.v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; },
        onComplete: () => { el.textContent = prefix + end.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; }
      })
    });
  });

  /* ---------------------------------------------------------------
     6. Layout settles after lazy images / webfonts
  --------------------------------------------------------------- */
  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
