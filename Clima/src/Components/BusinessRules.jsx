/**
 * BusinessRules.jsx
 * Panel informativo que muestra las reglas de negocio
 * utilizadas para la evaluación climática.
 * No recibe props (información estática).
 */

// Definición estática de las reglas por variable
const REGLAS = [
  {
    variable: "🌡️ Temperatura",
    reglas: [
      { rango: "15 – 30°C", nivel: "Realizar", clase: "realizar" },
      { rango: "10 – 14°C  ó  31 – 34°C", nivel: "Precaución", clase: "precaucion" },
      { rango: "< 10°C  ó  ≥ 35°C", nivel: "Reprogramar", clase: "reprogramar" },
    ],
  },
  {
    variable: "🌧️ Precipitación",
    reglas: [
      { rango: "0 mm", nivel: "Realizar", clase: "realizar" },
      { rango: "0.1 – 4.9 mm", nivel: "Precaución", clase: "precaucion" },
      { rango: "≥ 5 mm", nivel: "Reprogramar", clase: "reprogramar" },
    ],
  },
  {
    variable: "💨 Viento",
    reglas: [
      { rango: "< 20 km/h", nivel: "Realizar", clase: "realizar" },
      { rango: "20 – 39 km/h", nivel: "Precaución", clase: "precaucion" },
      { rango: "≥ 40 km/h", nivel: "Reprogramar", clase: "reprogramar" },
    ],
  },
];

const BusinessRules = () => {
  return (
    <div className="business-rules">
      {/* Título del panel */}
      <p className="panel-title">📋 Reglas utilizadas</p>

      {/* Iterar sobre cada variable y sus reglas */}
      {REGLAS.map(({ variable, reglas }) => (
        <div className="rules-section" key={variable}>
          <p className="rules-var">{variable}</p>
          <ul className="rules-list">
            {reglas.map(({ rango, nivel, clase }) => (
              <li key={nivel}>
                {/* Punto de color indicador */}
                <span className={`dot ${clase}`} aria-hidden="true" />
                <span>{rango}</span>
                <span style={{ marginLeft: 'auto', opacity: 0.7 }}>→ {nivel}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Regla final de lógica combinada */}
      <div className="rules-section">
        <p className="rules-var">⚖️ Lógica final</p>
        <ul className="rules-list">
          <li>
            <span className="dot reprogramar" aria-hidden="true" />
            Si alguna variable es Reprogramar → Reprogramar
          </li>
          <li>
            <span className="dot precaucion" aria-hidden="true" />
            Si alguna es Precaución (sin Reprogramar) → Precaución
          </li>
          <li>
            <span className="dot realizar" aria-hidden="true" />
            Si todas son favorables → Realizar
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BusinessRules;
