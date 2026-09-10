/**
 * RiskCard.jsx
 * Tarjeta principal de riesgo: muestra el nivel final de la evaluación
 * con una animación contextual según la causa del resultado.
 *
 * Props:
 * - nivelFinal  {string}  Nivel de riesgo final ("Realizar" | "Precaución" | "Reprogramar")
 * - emoji       {string}  Emoji semáforo del nivel final
 * - clase       {string}  Clase CSS del nivel ("realizar" | "precaucion" | "reprogramar")
 * - detalles    {Object}  Evaluaciones individuales de cada variable climática
 */

// Textos descriptivos para cada nivel de riesgo final
const DESCRIPCION_NIVEL = {
  Realizar:
    "Las condiciones climáticas son favorables. ¡Es un buen momento para tu actividad al aire libre!",
  Precaución:
    "Las condiciones presentan algunos factores de riesgo. Procede con precaución y prepárate adecuadamente.",
  Reprogramar:
    "Las condiciones climáticas no son seguras. Se recomienda reprogramar la actividad para otro momento.",
};

/**
 * Determina qué tipo de animación mostrar según las variables problemáticas.
 * Prioridad: precipitacion > temperatura > viento > (sol si todo OK)
 *
 * @param {string} nivelFinal
 * @param {Object} detalles - { temperatura, precipitacion, viento } con { nivel }
 * @returns {string} tipo de animación: "rain" | "heat" | "wind" | "sun"
 */
const getAnimationType = (nivelFinal, detalles) => {
  if (!detalles) return "sun";

  if (nivelFinal === "Realizar") return "sun";

  // Buscar la variable más grave (Reprogramar primero, luego Precaución)
  const prioridad = ["precipitacion", "temperatura", "viento"];

  // Primero buscamos si alguna es Reprogramar
  for (const variable of prioridad) {
    if (detalles[variable]?.nivel === "Reprogramar") {
      if (variable === "precipitacion") return "rain";
      if (variable === "temperatura") return "heat";
      if (variable === "viento") return "wind";
    }
  }

  // Si ninguna es Reprogramar, buscamos Precaución
  for (const variable of prioridad) {
    if (detalles[variable]?.nivel === "Precaución") {
      if (variable === "precipitacion") return "rain";
      if (variable === "temperatura") return "heat";
      if (variable === "viento") return "wind";
    }
  }

  return "sun";
};

// ── Sub-componentes de animación ──

/** Lluvia: gotas cayendo */
const RainAnimation = () => (
  <div className="risk-anim rain-anim" aria-hidden="true">
    {Array.from({ length: 18 }).map((_, i) => (
      <span className="raindrop" key={i} />
    ))}
  </div>
);

/** Calor: ondas de calor ascendentes */
const HeatAnimation = () => (
  <div className="risk-anim heat-anim" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <span className="heat-wave" key={i} />
    ))}
    <span className="heat-sun" aria-hidden="true">☀️</span>
  </div>
);

/** Viento: ráfagas horizontales */
const WindAnimation = () => (
  <div className="risk-anim wind-anim" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => (
      <span className="wind-streak" key={i} />
    ))}
  </div>
);

/** Sol: rayos giratorios y brillos */
const SunAnimation = () => (
  <div className="risk-anim sun-anim" aria-hidden="true">
    <span className="sun-core" aria-hidden="true">✨</span>
    {Array.from({ length: 8 }).map((_, i) => (
      <span className="sun-ray" key={i} style={{ '--ray-index': i }} />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <span className="sparkle" key={i} />
    ))}
  </div>
);

// Mapa de tipo de animación → componente
const ANIMATION_MAP = {
  rain: <RainAnimation />,
  heat: <HeatAnimation />,
  wind: <WindAnimation />,
  sun: <SunAnimation />,
};

const RiskCard = ({ nivelFinal, emoji, clase, detalles }) => {
  // Determinar qué animación mostrar
  const animType = getAnimationType(nivelFinal, detalles);

  return (
    <div className={`risk-card ${clase}`} aria-label={`Resultado: ${nivelFinal}`}>
      {/* Efecto de brillo detrás del contenido */}
      <div className="risk-card-glow" aria-hidden="true" />

      {/* Animación contextual (lluvia / calor / viento / sol) */}
      {ANIMATION_MAP[animType]}

      {/* Etiqueta */}
      <p className="risk-card-title">Resultado Final</p>

      {/* Emoji principal */}
      <span className="risk-card-emoji" role="img" aria-label={nivelFinal}>
        {emoji}
      </span>

      {/* Nivel de riesgo */}
      <p className="risk-card-level">{nivelFinal}</p>

      {/* Descripción */}
      <p className="risk-card-desc">{DESCRIPCION_NIVEL[nivelFinal]}</p>
    </div>
  );
};

export default RiskCard;
