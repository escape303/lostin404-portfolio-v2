import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useReducedMotion } from "motion/react";

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
  uniform float uAmp;
  uniform float uBlend;
  uniform float uSpeed;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);
    float t = uTime * uSpeed;

    float n1 = fbm(vec2(p.x * 1.6, p.y * 1.1 + t * 0.25));
    float n2 = fbm(vec2(p.x * 2.9 + 4.0, p.y * 1.6 - t * 0.18));

    float band = uv.y + (n1 - 0.5) * 0.42 * uAmp + (n2 - 0.5) * 0.22 * uAmp;

    float core = exp(-pow((band - 0.58) * 3.4, 2.0));
    float halo = exp(-pow((band - 0.34) * 4.2, 2.0));
    float outer = exp(-pow((band - 0.76) * 5.2, 2.0));

    vec3 col = mix(uC1, uC2, smoothstep(0.0, 1.0, uv.x * 1.15));
    col = mix(col, uC3, pow(halo, 2.0) * 0.65);
    col = mix(col, uC3, pow(outer, 3.0) * 0.35);

    float a = (core * 0.5 + halo * 0.3 + outer * 0.2) * uBlend * 1.9;
    a *= smoothstep(0.02, 0.4, uv.y) * smoothstep(0.02, 0.3, 1.0 - uv.y);

    gl_FragColor = vec4(col, clamp(a, 0.0, 0.9));
  }
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

type Props = {
  className?: string;
  colors?: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
};

/**
 * Aurora illumination behind the hero headline. Alpha-blended floating shader
 * with a static gradient fallback when WebGL is unavailable or the visitor
 * prefers reduced motion. Pauses when off-screen or the tab is hidden.
 */
export function Aurora({
  className = "",
  colors = ["#3A29FF", "#5227FF", "#BFFF00"],
  amplitude = 0.75,
  blend = 0.55,
  speed = 0.28,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const host = hostRef.current;
    if (!host) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch {
      setFailed(true);
      return;
    }

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
        uAmp: { value: amplitude },
        uBlend: { value: blend },
        uSpeed: { value: speed },
        uC1: { value: hexToRgb(colors[0]) },
        uC2: { value: hexToRgb(colors[1]) },
        uC3: { value: hexToRgb(colors[2]) },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth, clientHeight } = host;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight);
      program.uniforms.uRes.value = [clientWidth, clientHeight];
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let visible = true;
    let onScreen = true;
    const start = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !onScreen) return;
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      try {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        /* already gone */
      }
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
    };
  }, [reduce, amplitude, blend, speed, colors]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Static fallback and the base wash behind the shader. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 55% at 50% 62%, ${colors[0]}55 0%, transparent 70%), radial-gradient(42% 40% at 72% 48%, ${colors[1]}44 0%, transparent 72%), radial-gradient(30% 28% at 28% 55%, ${colors[2]}1f 0%, transparent 74%)`,
        }}
      />
      {!reduce && !failed && <div ref={hostRef} className="absolute inset-0" />}
      {/* Legibility veil + vignette over the light. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_25%,rgba(10,12,14,0.55)_75%,#0A0C0E_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-ground" />
    </div>
  );
}
