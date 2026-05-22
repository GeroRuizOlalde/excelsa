// Textura de líneas topográficas — el motivo "montaña" de Excelsa.
// Curvas de nivel concéntricas que evocan un mapa de altimetría / una cumbre.

type Tone = "navy" | "cream" | "clay" | "sand";

const STROKE: Record<Tone, string> = {
  navy:  "rgba(255,255,255,0.10)",
  cream: "rgba(0,35,102,0.06)",
  clay:  "rgba(193,95,60,0.16)",
  sand:  "rgba(26,22,17,0.05)",
};

export default function ContourBg({
  tone = "cream",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  const stroke = STROKE[tone];
  // 9 curvas de nivel concéntricas, ligeramente desplazadas hacia la cumbre.
  const rings = Array.from({ length: 9 });

  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke={stroke} strokeWidth="1.25">
        {rings.map((_, i) => {
          const k = i + 1;
          const rx = 90 + k * 88;
          const ry = 60 + k * 52;
          // cada anillo se corre un poco hacia arriba-derecha → sensación de pendiente
          const cx = 760 + k * 10;
          const cy = 470 - k * 14;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              transform={`rotate(-12 ${cx} ${cy})`}
            />
          );
        })}
      </g>
    </svg>
  );
}
