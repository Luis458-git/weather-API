/**
 * WeatherCard.jsx
 * Tarjeta reutilizable para mostrar un dato climático individual.
 *
 * Props:
 * - label      {string}  Nombre de la variable (ej. "Temperatura")
 * - value      {number}  Valor numérico del dato
 * - unit       {string}  Unidad de medida (ej. "°C", "mm", "km/h", "%")
 * - icon       {string}  Emoji del ícono representativo
 * - nivel      {string}  Nivel de riesgo evaluado ("Realizar" | "Precaución" | "Reprogramar")
 * - clase      {string}  Clase CSS del nivel ("realizar" | "precaucion" | "reprogramar")
 * - color      {string}  Color CSS para el acento de la tarjeta
 */
const WeatherCard = ({ label, value, unit, icon, nivel, clase, color }) => {
  return (
    <div
      className="weather-card"
      style={{ '--card-color': color }}
      aria-label={`${label}: ${value}${unit}`}
    >
      {/* Encabezado: etiqueta + ícono */}
      <div className="weather-card-header">
        <span className="weather-card-label">{label}</span>
        <span className="weather-card-icon" aria-hidden="true">{icon}</span>
      </div>

      {/* Valor principal */}
      <div className="weather-card-value">
        {value}
        <span> {unit}</span>
      </div>

      {/* Estado evaluado */}
      <span className={`weather-card-status ${clase}`}>
        {nivel === 'Realizar' && '🟢'}
        {nivel === 'Precaución' && '🟡'}
        {nivel === 'Reprogramar' && '🔴'}
        {' '}{nivel}
      </span>
    </div>
  );
};

export default WeatherCard;
