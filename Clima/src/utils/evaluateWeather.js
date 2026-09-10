// =====================================================
// evaluateWeather.js
// Lógica de negocio para evaluar las condiciones
// climáticas según las reglas definidas en el proyecto.
// SEPARADO completamente de la interfaz de usuario.
// =====================================================

// Niveles de riesgo posibles
export const NIVELES = {
  REALIZAR: "Realizar",
  PRECAUCION: "Precaución",
  REPROGRAMAR: "Reprogramar",
};

// Emojis de semáforo asociados a cada nivel
export const NIVEL_EMOJI = {
  [NIVELES.REALIZAR]: "🟢",
  [NIVELES.PRECAUCION]: "🟡",
  [NIVELES.REPROGRAMAR]: "🔴",
};

// Clases CSS asociadas a cada nivel
export const NIVEL_CLASS = {
  [NIVELES.REALIZAR]: "realizar",
  [NIVELES.PRECAUCION]: "precaucion",
  [NIVELES.REPROGRAMAR]: "reprogramar",
};

// -------------------------------------------------------
// Reglas individuales por variable climática
// -------------------------------------------------------

/**
 * Evalúa la temperatura según las reglas de negocio.
 * @param {number} temp - Temperatura en °C
 * @returns {Object} { nivel, descripcion }
 */
export const evaluarTemperatura = (temp) => {
  if (temp >= 15 && temp <= 30) {
    return {
      nivel: NIVELES.REALIZAR,
      descripcion: `${temp}°C — Temperatura ideal para actividades al aire libre.`,
    };
  } else if ((temp >= 10 && temp < 15) || (temp > 30 && temp <= 34)) {
    return {
      nivel: NIVELES.PRECAUCION,
      descripcion: `${temp}°C — Temperatura en rango de precaución. Tomar medidas adicionales.`,
    };
  } else {
    return {
      nivel: NIVELES.REPROGRAMAR,
      descripcion: `${temp}°C — Temperatura extrema. No se recomienda la actividad.`,
    };
  }
};

/**
 * Evalúa la precipitación según las reglas de negocio.
 * @param {number} prec - Precipitación en mm
 * @returns {Object} { nivel, descripcion }
 */
export const evaluarPrecipitacion = (prec) => {
  if (prec === 0) {
    return {
      nivel: NIVELES.REALIZAR,
      descripcion: `${prec} mm — Sin precipitación. Condiciones óptimas.`,
    };
  } else if (prec > 0 && prec < 5) {
    return {
      nivel: NIVELES.PRECAUCION,
      descripcion: `${prec} mm — Lluvia ligera. Considerar llevar protección.`,
    };
  } else {
    return {
      nivel: NIVELES.REPROGRAMAR,
      descripcion: `${prec} mm — Lluvia intensa. Reprogramar la actividad.`,
    };
  }
};

/**
 * Evalúa la velocidad del viento según las reglas de negocio.
 * @param {number} viento - Velocidad del viento en km/h
 * @returns {Object} { nivel, descripcion }
 */
export const evaluarViento = (viento) => {
  if (viento < 20) {
    return {
      nivel: NIVELES.REALIZAR,
      descripcion: `${viento} km/h — Viento suave. Sin riesgo.`,
    };
  } else if (viento >= 20 && viento < 40) {
    return {
      nivel: NIVELES.PRECAUCION,
      descripcion: `${viento} km/h — Viento moderado. Precaución con objetos ligeros.`,
    };
  } else {
    return {
      nivel: NIVELES.REPROGRAMAR,
      descripcion: `${viento} km/h — Viento fuerte. Peligroso para actividades al aire libre.`,
    };
  }
};

// -------------------------------------------------------
// Lógica final de evaluación consolidada
// -------------------------------------------------------

/**
 * Determina el nivel de riesgo final combinando los resultados
 * de temperatura, precipitación y viento.
 *
 * Reglas:
 * - Si alguna condición es "Reprogramar" → resultado = Reprogramar
 * - Si ninguna es Reprogramar pero alguna es "Precaución" → resultado = Precaución
 * - Si todas son favorables → resultado = Realizar
 *
 * @param {Object} datos - { temperatura, humedad, precipitacion, viento }
 * @returns {Object} Resultado completo de la evaluación
 */
export const evaluarClima = (datos) => {
  const { temperatura, precipitacion, viento } = datos;

  const evalTemp = evaluarTemperatura(temperatura);
  const evalPrec = evaluarPrecipitacion(precipitacion);
  const evalViento = evaluarViento(viento);

  const resultados = [evalTemp, evalPrec, evalViento];
  const niveles = resultados.map((r) => r.nivel);

  // Determinar el nivel final según la lógica de negocio
  let nivelFinal;
  if (niveles.includes(NIVELES.REPROGRAMAR)) {
    nivelFinal = NIVELES.REPROGRAMAR;
  } else if (niveles.includes(NIVELES.PRECAUCION)) {
    nivelFinal = NIVELES.PRECAUCION;
  } else {
    nivelFinal = NIVELES.REALIZAR;
  }

  return {
    nivelFinal,
    emoji: NIVEL_EMOJI[nivelFinal],
    clase: NIVEL_CLASS[nivelFinal],
    detalles: {
      temperatura: evalTemp,
      precipitacion: evalPrec,
      viento: evalViento,
    },
  };
};
