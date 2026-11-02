/* Light Rays: dependency-free WebGL port of the React Bits "Light Rays" idea.
   Usage: const rays = MBLightRays.mount(heroElement, { color:'#F6C862' });  rays && rays.destroy();
   - renders at half resolution (soft effect, cheap on phones)
   - pauses when off-screen or when the tab is hidden
   - { animate:false } draws a single still frame (used for prefers-reduced-motion) */
(function () {
  "use strict";

  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 uRes;uniform float uTime;uniform vec3 uColor;uniform vec2 uSrc;",
    "uniform float uSpread;uniform float uLength;uniform float uFade;uniform float uSpeed;",
    "float ray(vec2 src,vec2 coord,float sa,float sb,float sp){",
    "  vec2 d=coord-src;float dist=length(d);vec2 dn=d/max(dist,.0001);",
    "  float c=dot(dn,vec2(0.,1.));",
    "  float spread=pow(max(c,0.),1./max(uSpread,.001));",
    "  float maxD=uRes.x*uLength;",
    "  float lenF=clamp((maxD-dist)/maxD,0.,1.);",
    "  float fadeF=clamp((uRes.x*uFade-dist)/(uRes.x*uFade),.5,1.);",
    "  float base=clamp((.45+.15*sin(c*sa+uTime*sp))+(.3+.2*cos(-c*sb+uTime*sp)),0.,1.);",
    "  return base*lenF*fadeF*spread;",
    "}",
    "void main(){",
    "  vec2 coord=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);",
    "  float s=ray(uSrc*uRes,coord,36.2214,21.11349,1.5*uSpeed)*.5+ray(uSrc*uRes,coord,22.3991,18.0234,1.1*uSpeed)*.4;",
    "  float br=1.-coord.y/uRes.y;",
    "  s*=.25+.75*br;",
    "  gl_FragColor=vec4(uColor*s,1.);",
    "}"
  ].join("\n");

  function hex(h) {
    h = String(h).replace("#", "");
    if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
    var n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }

  function mount(host, opts) {
    if (!host) return null;
    var o = Object.assign({
      color: "#F6C862",   // site golden yellow
      speed: 0.5,         // calm
      spread: 0.7,
      length: 1.4,
      fade: 1,
      origin: [0.5, -0.2],// top-centre, slightly above the hero
      scale: 0.5,         // render scale
      fps: 30,
      animate: true
    }, opts || {});

    var canvas = document.createElement("canvas");
    canvas.className = "hero__rays";
    canvas.setAttribute("aria-hidden", "true");
    var gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return null;

    var vs = shader(gl, gl.VERTEX_SHADER, VS), fs = shader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ["uRes", "uTime", "uColor", "uSrc", "uSpread", "uLength", "uFade", "uSpeed"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.uniform3fv(U.uColor, hex(o.color));
    gl.uniform2f(U.uSrc, o.origin[0], o.origin[1]);
    gl.uniform1f(U.uSpread, o.spread);
    gl.uniform1f(U.uLength, o.length);
    gl.uniform1f(U.uFade, o.fade);
    gl.uniform1f(U.uSpeed, o.speed);

    host.insertBefore(canvas, host.children[1] || null); // after the hero <img>

    var raf = 0, visible = true, t0 = performance.now(), last = 0, destroyed = false;

    function size() {
      var w = Math.max(2, Math.round(host.clientWidth * o.scale));
      var h = Math.max(2, Math.round(host.clientHeight * o.scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.uRes, w, h);
    }
    function draw(t) {
      gl.uniform1f(U.uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function frame(now) {
      if (destroyed) return;
      raf = 0;
      if (visible && !document.hidden && now - last >= 1000 / o.fps) {
        last = now;
        draw((now - t0) / 1000);
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function start() { if (o.animate && !raf && !destroyed) raf = requestAnimationFrame(frame); }

    size();
    draw(4); // first frame straight away
    var ro = new ResizeObserver(function () { size(); draw(o.animate ? (performance.now() - t0) / 1000 : 4); });
    ro.observe(host);
    var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); });
    io.observe(host);
    function onVis() { if (!document.hidden) start(); }
    document.addEventListener("visibilitychange", onVis);
    start();

    return {
      canvas: canvas,
      destroy: function () {
        destroyed = true; if (raf) cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        canvas.remove();
      }
    };
  }

  window.MBLightRays = { mount: mount };
})();
