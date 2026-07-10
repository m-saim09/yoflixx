import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { WORLD_PATHS } from "./world-paths";

type Market = {
  code: string;
  name: string;
  lon: number;
  lat: number;
  labelDx?: number;
  labelDy?: number;
};

const MAP_W = 1000;
const MAP_H = 500;

const project = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * MAP_W,
  y: ((90 - lat) / 180) * MAP_H,
});

const MARKETS: Market[] = [
  { code: "USA", name: "United States", lon: -98, lat: 39, labelDy: 18, labelDx: -8 },
  { code: "CAN", name: "Canada", lon: -106, lat: 56, labelDy: -18 },
  { code: "DEU", name: "Germany", lon: 13.4, lat: 52.5, labelDy: -14 },
  { code: "ESP", name: "Spain", lon: -3.7, lat: 40.4, labelDy: 18, labelDx: 4 },
  { code: "ITA", name: "Italy", lon: 12.5, lat: 41.9, labelDy: 20, labelDx: 6 },
  { code: "SWE", name: "Sweden", lon: 18.1, lat: 59.3, labelDy: -18, labelDx: 6 },
  { code: "UAE", name: "UAE", lon: 55.3, lat: 25.2, labelDy: 20, labelDx: 4 },
  { code: "SAU", name: "Saudi Arabia", lon: 46.7, lat: 24.7, labelDy: 20, labelDx: -6 },
  { code: "AUS", name: "Australia", lon: 134, lat: -25, labelDy: 20 },
];

const HUB_CODE = "DEU";

function curvedPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const curvature = Math.min(dist * 0.22, 120);
  const cx = mx + nx * curvature;
  const cy = my + ny * curvature - Math.min(dist * 0.07, 24);
  return `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export function GlobalPresence() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [hovered, setHovered] = useState<string | null>(null);

  const points = useMemo(
    () => MARKETS.map((m) => ({ ...m, ...project(m.lon, m.lat) })),
    [],
  );
  const hub = points.find((p) => p.code === HUB_CODE)!;
  const spokes = points.filter((p) => p.code !== HUB_CODE);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white py-28 md:py-36"
    >
      {/* floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full bg-[#2563EB]/40"
          style={{
            top: `${15 + ((i * 13) % 70)}%`,
            left: `${8 + ((i * 17) % 84)}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-[1400px] px-6"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-[#2563EB]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_#2563EB]" />
            Where our clients sell
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-[#0F172A] md:text-5xl lg:text-[56px] lg:leading-[1.05]"
          >
            Sellers in 12+ markets
          </motion.h2>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16"
        >
          <div className="relative mx-auto aspect-[2/1] w-full">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="continentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EEF2F7" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
                <filter id="continentShadow" x="-5%" y="-5%" width="110%" height="115%">
                  <feDropShadow
                    dx="0"
                    dy="1.2"
                    stdDeviation="1.2"
                    floodColor="#0F172A"
                    floodOpacity="0.08"
                  />
                </filter>
                <radialGradient id="markerGlow">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>
                <filter id="lineGlow">
                  <feGaussianBlur stdDeviation="1.6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* continents */}
              <g
                fill="url(#continentFill)"
                stroke="#CBD5E1"
                strokeWidth={0.4}
                filter="url(#continentShadow)"
              >
                {WORLD_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>

              {/* connection lines */}
              <g
                fill="none"
                stroke="#2563EB"
                strokeWidth={1.1}
                strokeLinecap="round"
                filter="url(#lineGlow)"
                opacity={0.9}
              >
                {spokes.map((p, i) => {
                  const dPath = curvedPath(p.x, p.y, hub.x, hub.y);
                  return (
                    <motion.path
                      key={p.code}
                      d={dPath}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={inView ? { pathLength: 1, opacity: 0.85 } : {}}
                      transition={{
                        duration: 1.2,
                        delay: 0.9 + i * 0.12,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
              </g>

              {/* markers */}
              <g>
                {points.map((p, i) => {
                  const isHub = p.code === HUB_CODE;
                  const isHovered = hovered === p.code;
                  return (
                    <motion.g
                      key={p.code}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.45,
                        delay: 0.7 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHovered(p.code)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <circle cx={p.x} cy={p.y} r={18} fill="url(#markerGlow)" />
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        r={6}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth={1.2}
                        animate={{ r: [6, 16], opacity: [0.6, 0] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          delay: i * 0.25,
                          ease: "easeOut",
                        }}
                      />
                      {isHovered && (
                        <motion.circle
                          cx={p.x}
                          cy={p.y}
                          r={6}
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth={1.4}
                          initial={{ r: 6, opacity: 0.9 }}
                          animate={{ r: 22, opacity: 0 }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      )}
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        r={isHub ? 7.5 : 6}
                        fill="#0F172A"
                        animate={{ scale: isHovered ? 1.35 : 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18 }}
                        style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHub ? 2.6 : 2}
                        fill="#FFFFFF"
                      />
                      <motion.text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        className="fill-[#2563EB]"
                        style={{
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: 0.6,
                        }}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.0 + i * 0.08, duration: 0.4 }}
                      >
                        {p.code}
                      </motion.text>
                      <motion.text
                        x={p.x + (p.labelDx ?? 0)}
                        y={p.y + (p.labelDy ?? 18)}
                        textAnchor="middle"
                        className="fill-[#0F172A]"
                        style={{ fontSize: 9.5, fontWeight: 600 }}
                        initial={{ opacity: 0, y: (p.labelDy ?? 18) + 4 }}
                        animate={
                          inView
                            ? { opacity: 1, y: p.labelDy ?? 18 }
                            : {}
                        }
                        transition={{ delay: 1.15 + i * 0.08, duration: 0.5 }}
                      >
                        {p.name}
                      </motion.text>
                    </motion.g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* stat chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {[
              { k: "11+", v: "Global Markets" },
              { k: "20+", v: "Marketplaces" },
              { k: "500+", v: "Sellers Empowered" },
              { k: "24/7", v: "Account Support" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-[#E2E8F0] bg-white/70 p-5 text-center shadow-[0_1px_0_rgba(15,23,42,0.03),0_10px_30px_-15px_rgba(15,23,42,0.15)] backdrop-blur"
              >
                <div className="text-2xl font-semibold text-[#0F172A] md:text-3xl">
                  {s.k}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default GlobalPresence;
