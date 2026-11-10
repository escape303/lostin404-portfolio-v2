import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import ProjectPage from "./pages/ProjectPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

const OUT_MS = 200;
const IN_MS = 300;

/**
 * Out-in page transition with explicit phases: the current page fades and
 * lifts away, then the next route mounts at the top and fades in from below.
 * State-driven so the route swap can never deadlock.
 */
export default function App() {
  const location = useLocation();
  const reduce = useReducedMotion();

  const [shownPath, setShownPath] = useState(location.pathname);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const shownRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === shownRef.current) return;

    if (reduce) {
      shownRef.current = location.pathname;
      setShownPath(location.pathname);
      setPhase("in");
      window.scrollTo(0, 0);
      return;
    }

    setPhase("out");
    const timer = window.setTimeout(() => {
      shownRef.current = location.pathname;
      setShownPath(location.pathname);
      window.scrollTo(0, 0);
      setPhase("in");
    }, OUT_MS);

    return () => window.clearTimeout(timer);
  }, [location.pathname, reduce]);

  const renderedLocation = { ...location, pathname: shownPath };
  const duration = phase === "out" ? OUT_MS : IN_MS;

  return (
    <div className="flex min-h-svh flex-col bg-ground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-ground"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" className="flex-1">
        <div
          key={shownPath}
          style={{
            opacity: phase === "out" ? 0 : 1,
            // Opacity only: a transform here would create a containing block and
            // break the fixed positioning GSAP ScrollTrigger uses for pinning.
            transition: reduce
              ? undefined
              : `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1)`,
          }}
        >
          <Routes location={renderedLocation}>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}
