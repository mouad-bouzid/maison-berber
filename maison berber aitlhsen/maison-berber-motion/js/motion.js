/* Maison Berber Ait Lhsen: motion layer
   GSAP + ScrollTrigger + Lenis (Lenis driven by the GSAP ticker), plus vanilla ports of
   React Bits-style effects: Blur Text, Light Rays (js/light-rays.js), Star Border, count-up.
   Texts and colours are never changed here. Everything calm-by-default and
   switched off / made static when the visitor prefers reduced motion. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var hero = $(".hero");

  /* ---------- Star Border around the main hero CTA (CSS-only animation) ---------- */
  (function starBorder() {
    var cta = $("[data-star-border], .hero .cta-orbit");
    if (!cta || (cta.parentElement && cta.parentElement.classList.contains("star-border"))) return;
    var wrap = document.createElement("span");
    wrap.className = "star-border";
    var track = document.createElement("span");
    track.className = "star-border__track";
    track.setAttribute("aria-hidden", "true");
    track.innerHTML = '<span class="star-border__star star-border__star--b"></span><span class="star-border__star star-border__star--t"></span>';
    cta.parentNode.insertBefore(wrap, cta);
    wrap.appendChild(track);
    wrap.appendChild(cta);
  })();

  /* ---------- Light Rays behind the hero (static single frame if reduced motion) ---------- */
  if (hero && window.MBLightRays) {
    try { window.MBLightRays.mount(hero, { color: "#F6C862", animate: !reduce }); } catch (e) { /* decorative only */ }
  }

  /* Reduced motion, or GSAP failed to load: show everything as-is and stop. */
  if (reduce || !hasGsap) {
    $$(".hero__title").forEach(function (el) { el.classList.add("is-split"); });
    $$(".hero__eyebrow,.hero__sub,.hero__actions,.booking").forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- Lenis smooth scroll, driven by GSAP's ticker ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Mobile menu locks the page: stop Lenis while it is open.
    new MutationObserver(function () {
      if (document.body.classList.contains("menu-open")) lenis.stop(); else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // In-page anchors scroll through Lenis (the skip link keeps native focus behaviour).
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains("skip")) return;
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.1 });
      if (history.replaceState) history.replaceState(null, "", id);
    });
    window.mbLenis = lenis;
  }

  /* ---------- Hero: Blur Text title + calm entrance ---------- */
  function initHero() {
    var title = $(".hero__title");
    var words = [], titleTl = null, orig = null, current = "";

    function split(text) {
      title.textContent = "";
      words = [];
      var parts = text.split(/\s+/).filter(Boolean);
      parts.forEach(function (w, i) {
        var s = document.createElement("span");
        s.className = "blur-word";
        s.setAttribute("aria-hidden", "true");
        s.textContent = w;
        title.appendChild(s);
        words.push(s);
        if (i < parts.length - 1) title.appendChild(document.createTextNode(" "));
      });
      title.setAttribute("aria-label", text.trim());
      title.classList.add("is-split");
      gsap.set(words, { opacity: 0, filter: "blur(12px)", y: -16 });
    }
    function playTitle(delay) {
      if (titleTl) titleTl.kill();
      titleTl = gsap.to(words, {
        keyframes: [
          { opacity: 0.5, filter: "blur(5px)", y: 4, duration: 0.3 },
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.3 }
        ],
        ease: "power2.out", stagger: 0.12, delay: delay,
        onComplete: function () { gsap.set(words, { clearProps: "opacity,filter,transform,willChange" }); }
      });
    }

    if (title) {
      orig = Array.prototype.filter.call(title.childNodes, function (n) { return n.nodeType === 3; })[0];
      if (orig && orig.nodeValue.trim()) {
        current = orig.nodeValue.trim();
        split(current);
        playTitle(0.25);
        // The EN/FR switcher rewrites the original (now detached) text node: follow it.
        new MutationObserver(function () {
          var t = (orig.nodeValue || "").trim();
          if (!t || t === current) return;
          current = t; split(t); playTitle(0.1);
        }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
      } else {
        title.classList.add("is-split");
      }
    }

    var tl = gsap.timeline({ delay: 0.1, defaults: { ease: "power3.out" } });
    function enter(sel, from, at) {
      var el = $(sel); if (!el) return;
      tl.fromTo(el, Object.assign({ opacity: 0 }, from), {
        opacity: 1, x: 0, y: 0, duration: 0.8,
        onComplete: function () { el.classList.add("is-in"); gsap.set(el, { clearProps: "opacity,transform" }); }
      }, at);
    }
    enter(".hero__eyebrow", { y: 12 }, 0);
    enter(".booking", { y: 20 }, 0.55);
    enter(".hero__sub", { y: 14 }, 0.9);
    enter(".hero__actions", { y: 14 }, 1.05);
  }

  /* ---------- Section reveals (one soft fade-up each, cards staggered) ---------- */
  function initReveals() {
    var inHero = function (el) { return !!el.closest(".hero"); };

    var singles = $$("main .statement__line, main .statement__sub, main .shead, main .split__media, main .split__copy, main .note, main .gal__track, main .gal__range, main .closer__card")
      .filter(function (el) { return !inHero(el); });
    singles.forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 28 });
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            onComplete: function () { gsap.set(el, { clearProps: "opacity,transform" }); } });
        }
      });
    });

    var groupSel = "main .tcard, main .promise, main .faq__item";
    var group = $$(groupSel).filter(function (el) { return !inHero(el); });
    if (group.length) {
      gsap.set(group, { opacity: 0, y: 28 });
      ScrollTrigger.batch(group, {
        start: "top 90%", once: true,
        onEnter: function (batch) {
          batch.forEach(function (el) { el.classList.add("is-revealing"); });
          gsap.to(batch, {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true,
            onComplete: function () {
              batch.forEach(function (el) { el.classList.remove("is-revealing"); });
              gsap.set(batch, { clearProps: "opacity,transform" });
            }
          });
        }
      });
    }
  }

  /* ---------- Count-up for genuine numbers: add data-countup to an element whose text is the number ---------- */
  function initCountUp() {
    $$("[data-countup]").forEach(function (el) {
      var node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      var finalText = node.nodeValue;
      var m = finalText.match(/^(\D*)(\d[\d.,]*)([\s\S]*)$/);
      if (!m) return;
      var raw = m[2], target = parseFloat(raw.replace(/,/g, ""));
      if (isNaN(target)) return;
      var dec = (raw.split(".")[1] || "").length, group = raw.indexOf(",") > -1;
      var fmt = function (v) {
        return m[1] + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: group }) + m[3];
      };
      var o = { v: 0 };
      node.nodeValue = fmt(0);
      ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () {
          gsap.to(o, { v: target, duration: 1.8, ease: "power2.out",
            onUpdate: function () { node.nodeValue = fmt(o.v); },
            onComplete: function () { node.nodeValue = finalText; } });
        }
      });
    });
  }

  function boot() {
    initHero();
    initReveals();
    initCountUp();
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  // The EN/FR switcher indexes text nodes on DOMContentLoaded; split the title only after that.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
