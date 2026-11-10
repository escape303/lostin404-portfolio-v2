import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useReducedMotion } from "motion/react";
import { brand } from "../data/site";
import { Reveal } from "./Reveal";

const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  varying vec2 vUv;

  float band(vec2 uv, float y, float freq, float amp, float spd, float thick, float phase) {
    float wave = sin(uv.x * freq + phase + uTime * spd) * amp
               + sin(uv.x * freq * 0.47 - uTime * spd * 0.65 + phase * 1.7) * amp * 0.7;
    float d = abs(uv.y - (y + wave));
    return smoothstep(thick, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;
    vec3 col = vec3(0.0);

    float r1 = band(uv, 0.56, 2.4, 0.075, 0.20, 0.17, 0.0);
    float r2 = band(uv, 0.42, 3.1, 0.065, -0.16, 0.14, 1.7);
    float r3 = band(uv, 0.68, 1.9, 0.085, 0.13, 0.11, 3.4);

    col += vec3(0.39, 0.40, 0.945) * r1 * 0.95;
    col += vec3(0.32, 0.15, 1.0) * r2 * 0.85;
    col += vec3(0.49, 0.89, 1.0) * r3 * 0.5;

    float a = clamp(r1 * 0.95 + r2 * 0.85 + r3 * 0.5, 0.0, 1.0);
    col += vec3(0.12) * pow(a, 3.0);

    // fade toward the bottom so the type stays legible
    a *= smoothstep(0.0, 0.28, uv.y);
    gl_FragColor = vec4(col, a * 0.92);
  }
`;

/** Canvas-2D fallback drawing the same three sine ribbons as strokes. */
function draw2D(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  const ribbons = [
    { y: 0.56, freq: 2.4, amp: 0.075, spd: 0.2, color: "rgba(99,102,241,0.55)", lw: 46, ph: 0 },
    { y: 0.42, freq: 3.1, amp: 0.065, spd: -0.16, color: "rgba(82,39,255,0.5)", lw: 38, ph: 1.7 },
    { y: 0.68, freq: 1.9, amp: 0.085, spd: 0.13, color: "rgba(125,226,255,0.35)", lw: 30, ph: 3.4 },
  ];

  for (const r of ribbons) {
    ctx.beginPath();
    ctx.strokeStyle = r.color;
    ctx.lineWidth = r.lw;
    ctx.lineCap = "round";
    for (let x = 0; x <= w; x += 8) {
      const u = x / w;
      const wave =
        Math.sin(u * r.freq * Math.PI * 2 + r.ph + t * r.spd) * r.amp +
        Math.sin(u * r.freq * Math.PI * 0.94 - t * r.spd * 0.65 + r.ph * 1.7) * r.amp * 0.7;
      const y = h - (r.y + wave) * h;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

export function Ribbon() {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"gl" | "2d" | "static">("gl");

  useEffect(() => {
    if (reduce) {
      setMode("static");
      return;
    }
    const host = hostRef.current;
    if (!host) return;

    let renderer: Renderer | null = null;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch {
      renderer = null;
    }

    let raf = 0;
    let visible = true;
    let onScreen = true;
    let cleanup: () => void = () => {};

    if (renderer) {
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";
      host.appendChild(gl.canvas);

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: [1, 1] },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        const { clientWidth, clientHeight } = host;
        if (!clientWidth || !clientHeight) return;
        renderer!.setSize(clientWidth, clientHeight);
        program.uniforms.uRes.value = [clientWidth, clientHeight];
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const start = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || !onScreen) return;
        program.uniforms.uTime.value = (now - start) / 1000;
        renderer!.render({ scene: mesh });
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        try {
          gl.getExtension("WEBGL_lose_context")?.loseContext();
        } catch {
          /* already gone */
        }
        if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      };
      setMode("gl");
    } else {
      // Canvas 2D fallback.
      const canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      host.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = host.clientWidth * dpr;
        canvas.height = host.clientHeight * dpr;
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const start = performance.now();
      if (ctx) {
        const loop = (now: number) => {
          raf = requestAnimationFrame(loop);
          if (!visible || !onScreen) return;
          draw2D(ctx, host.clientWidth, host.clientHeight, (now - start) / 1000);
        };
        raf = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        if (canvas.parentNode === host) host.removeChild(canvas);
      };
      setMode("2d");
    }

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(host);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      cleanup();
    };
  }, [reduce]);

  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-deep pb-16 pt-32">
      <div ref={hostRef} className="absolute inset-0 z-0" aria-hidden="true">
        {mode === "static" && (
          <div className="absolute inset-0">
            <div className="absolute inset-x-0 top-[38%] h-24 -rotate-3 bg-[linear-gradient(90deg,transparent,rgba(99,102,241,0.35),transparent)] blur-2xl" />
            <div className="absolute inset-x-0 top-[52%] h-20 rotate-2 bg-[linear-gradient(90deg,transparent,rgba(82,39,255,0.3),transparent)] blur-2xl" />
            <div className="absolute inset-x-0 top-[64%] h-16 bg-[linear-gradient(90deg,transparent,rgba(125,226,255,0.18),transparent)] blur-2xl" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(5,5,5,0.35),transparent_35%,rgba(5,5,5,0.55)_75%,#050505)]" />

      <div className="shell relative z-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <p className="mono text-muted">Beyond the frame</p>
          </div>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,7.6vw,6.6rem)] font-extrabold leading-[0.86] tracking-[-0.045em] text-ink">
            {brand.signature}
          </h2>
          <div className="mt-6 grid gap-6 border-t border-hair pt-6 md:grid-cols-12">
            <p className="max-w-[46ch] text-sm leading-relaxed text-muted md:col-span-6">
              Light, motion and typography are the raw material. The same discipline that shapes a
              poster or a brand mark is what carries a frame of cinematic content — rendered here as
              a living gradient rather than a photograph.
            </p>
            <p className="mono-sm text-dim md:col-span-6 md:text-right">
              Generated in WebGL · No image assets
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
