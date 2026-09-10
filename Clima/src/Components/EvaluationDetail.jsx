/**
 * EvaluationDetail.jsx
 * Panel que muestra la explicación detallada de cada variable climática:
 * qué valor tuvo y por qué recibió ese nivel de riesgo.
 *
 * Props:
 * - detalles {Object} Objeto con las evaluaciones individuales:
 *     - temperatura    { nivel, descripcion, clase }
 *     - precipitacion  { nivel, descripcion, clase }
 *     - viento         { nivel, descripcion, clase }
 */

// Datos estáticos de configuración para cada variable
const VARIABLES = [
  {
    key: "temperatura",
    nombre: "Temperatura",
    icono: "🌡️",
  },
  {
    key: "precipitacion",
    nombre: "Precipitación",
    icono: "🌧️",
  },
  {
    key: "viento",
    nombre: "Viento",
    icono: "💨",
  },
];

/**
 * Mapea el nivel de riesgo a su clase CSS correspondiente.
 * @param {string} nivel
 * @returns {string}
 */
const claseDesdeNivel = (nivel) => {
  if (nivel === "Realizar") return "realizar";
  if (nivel === "Precaución") return "precaucion";
  return "reprogramar";
};

const EvaluationDetail = ({ detalles }) => {
  return (
    <div className="evaluation-detail">
      {/* Título del panel */}
      <p className="panel-title">🔍 Explicación por variable</p>

      {/* Iterar sobre cada variable y mostrar su evaluación */}
      {VARIABLES.map(({ key, nombre, icono }) => {
        const { nivel, descripcion } = detalles[key];
        const clase = claseDesdeNivel(nivel);

        return (
          <div className="detail-item" key={key}>
            {/* Encabezado: nombre de la variable + badge de nivel */}
            <div className="detail-item-header">
              <span className="detail-item-name">
                <span aria-hidden="true">{icono}</span>
                {nombre}
              </span>
              <span className={`detail-badge ${clase}`}>{nivel}</span>
            </div>

            {/* Descripción explicativa */}
            <p className="detail-item-desc">{descripcion}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EvaluationDetail;
