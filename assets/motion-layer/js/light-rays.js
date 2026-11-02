/* Light Rays — dependency-free WebGL port of the React Bits effect.
   Usage: const rays = window.initLightRays(heroElement, { static: false }); rays && rays.destroy(); */
(function () {
  "use strict";

  const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const FRAG = `
precision mediump float;
uniform float iTime;uniform vec2 iRes;uniform vec2 uOrigin;uniform float uDirX;
uniform vec3 uColA;uniform vec3 uColB;
uniform float uSpread;uniform float uLen;uniform float uFade;uniform float uSpeed;uniform float uDist;uniform float uIntensity;

float ray(vec2 src,vec2 dir,vec2 c,float sa,float sb,float sp){
  vec2 d=c-src;
  float ca=dot(normalize(d),dir);
  float da=ca+uDist*sin(iTime*2.+length(d)*.01)*.2;
  float spread=pow(max(da,0.),1./max(uSpread,.001));
  float dist=length(d);
  float maxD=iRes.x*uLen;
  float lenF=clamp((maxD-dist)/maxD,0.,1.);
  float fadeF=clamp((iRes.x*uFade-dist)/(iRes.x*uFade),.5,1.);
  float base=clamp((.45+.15*sin(da*sa+iTime*sp))+(.3+.2*cos(-da*sb+iTime*sp)),0.,1.);
  return base*lenF*fadeF*spread;
}
void main(){
  vec2 c=vec2(gl_FragCoord.x,iRes.y-gl_FragCoord.y);          /* top-left origin, y grows downward */
  vec2 src=uOrigin*iRes;
  vec2 dir=normalize(vec2(uDirX,1.));
  float r1=ray(src,dir,c,36.2214,21.11349,1.5*uSpeed);
  float r2=ray(src,dir,c,22.3991,18.0234,1.1*uSpeed);
  float s=r1*.5+r2*.4;
  float bright=1.-(c.y/iRes.y);
  s*=.1+bright*.8;
  s=clamp(s*uIntensity,0.,1.);
  vec3 col=mix(uColB,uColA,smoothstep(0.,.7,s));
  gl_FragColor=vec4(col*s,s);                                   /* premultiplied alpha */
}`;

  function hexToRgb(h) {
    h = (h || "").trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return null;
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }

  window.initLightRays = function (container, options) {
    if (!container) return null;
    const cs = getComputedStyle(document.documentElement);
    const o = Object.assign({
      origin: [0.72, -0.12],      // x,y as fraction of the container (top-left origin)
      dirX: -0.18,                // slight lean towards the copy side
      spread: 0.55, length: 1.8, fade: 1.0, speed: 0.55, distortion: 0.06, intensity: 1.25,
      scale: 0.5,                 // render resolution vs CSS size — rays are soft, so half-res is plenty
      colorA: hexToRgb(cs.getPropertyValue("--accent")) || [0.89, 0.345, 0.17],        // site accent
      colorB: hexToRgb(cs.getPropertyValue("--glacier-hi")) || [0.9, 0.94, 0.93],      // site glacier
      static: false
    }, options || {});

    const canvas = document.createElement("canvas");
    canvas.className = "light-rays";
    canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return null;

    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const U = { t: u("iTime"), res: u("iRes"), origin: u("uOrigin"), dirX: u("uDirX"), a: u("uColA"), b: u("uColB"),
      spread: u("uSpread"), len: u("uLen"), fade: u("uFade"), speed: u("uSpeed"), dist: u("uDist"), inten: u("uIntensity") };
    gl.uniform2f(U.origin, o.origin[0], o.origin[1]);
    gl.uniform1f(U.dirX, o.dirX);
    gl.uniform3f(U.a, ...o.colorA); gl.uniform3f(U.b, ...o.colorB);
    gl.uniform1f(U.spread, o.spread); gl.uniform1f(U.len, o.length); gl.uniform1f(U.fade, o.fade);
    gl.uniform1f(U.speed, o.speed); gl.uniform1f(U.dist, o.distortion); gl.uniform1f(U.inten, o.intensity);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // sits right after the hero photo, below the hero's own dark gradient overlay
    const photo = container.querySelector(".hero__img");
    photo ? photo.after(canvas) : container.prepend(canvas);

    const resize = () => {
      const w = Math.max(2, Math.round(container.clientWidth * o.scale));
      const h = Math.max(2, Math.round(container.clientHeight * o.scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
    };
    const draw = (sec) => { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(U.t, sec); gl.drawArrays(gl.TRIANGLES, 0, 3); };

    let raf = 0, visible = true, t0 = performance.now(), destroyed = false;
    const loop = (now) => {
      raf = 0;
      if (destroyed || !visible || document.hidden) return;
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !o.static && !destroyed) raf = requestAnimationFrame(loop); };

    resize();
    draw(2);                                   // first frame (and the only one when static / reduced motion)
    requestAnimationFrame(() => canvas.classList.add("is-on"));

    let ro = null, io = null, onVis = null;
    if (!o.static) {
      ro = new ResizeObserver(() => { resize(); if (!raf) draw((performance.now() - t0) / 1000); });
      ro.observe(container);
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
      io.observe(container);
      onVis = () => { if (!document.hidden) start(); };
      document.addEventListener("visibilitychange", onVis);
      start();
    } else {
      ro = new ResizeObserver(() => { resize(); draw(2); });
      ro.observe(container);
    }

    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); canvas.remove(); });

    return {
      canvas,
      destroy() {
        destroyed = true;
        if (raf) cancelAnimationFrame(raf);
        ro && ro.disconnect(); io && io.disconnect();
        onVis && document.removeEventListener("visibilitychange", onVis);
        canvas.remove();
        const ext = gl.getExtension("WEBGL_lose_context"); ext && ext.loseContext();
      }
    };
  };
})();
