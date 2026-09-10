// =====================================================
// weatherService.js
// Servicio para consumir la API de Open-Meteo y
// gestionar el historial de evaluaciones con JSON Server
// =====================================================

export const REGIONES = [
  { id: 'san-jose', nombre: 'San José, Costa Rica', latitude: 9.9981, longitude: -84.1169 },
  { id: 'guatemala', nombre: 'Ciudad de Guatemala, Guatemala', latitude: 14.6349, longitude: -90.5069 },
  { id: 'quetzaltenango', nombre: 'Quetzaltenango, Guatemala', latitude: 14.8347, longitude: -91.5181 },
  { id: 'flores', nombre: 'Flores, Petén, Guatemala', latitude: 16.9226, longitude: -89.8994 },
  { id: 'san-salvador', nombre: 'San Salvador, El Salvador', latitude: 13.6929, longitude: -89.2182 },
  { id: 'tegucigalpa', nombre: 'Tegucigalpa, Honduras', latitude: 14.0723, longitude: -87.1921 },
  { id: 'managua', nombre: 'Managua, Nicaragua', latitude: 12.1364, longitude: -86.2514 },
  { id: 'panama', nombre: 'Ciudad de Panamá, Panamá', latitude: 8.9824, longitude: -79.5199 },
];

const DB_URL = "http://localhost:3001/evaluaciones";

/**
 * Obtiene los datos climáticos actuales desde la API de Open-Meteo.
 * Utiliza fetch con async/await para la petición asíncrona.
 * @returns {Object} Objeto con temperatura, humedad, precipitacion y viento
 */
export const getWeatherData = async (region = REGIONES[0]) => {
  const params = new URLSearchParams({
    latitude: region.latitude, longitude: region.longitude,
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto', forecast_days: '2',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el clima: ${response.status}`);
  }

  const data = await response.json();
  const current = data.current;
  if (!current || !['temperature_2m', 'relative_humidity_2m', 'precipitation', 'wind_speed_10m'].every(key => Number.isFinite(current[key]))) {
    throw new Error('No hay datos completos del clima para esta región.');
  }
  const daily = data.daily;

  // Extraer y mapear los valores de la API a nombres claros en español
  return {
    region,
    manana: daily?.time?.[1] ? {
      fecha: daily.time[1],
      minima: daily.temperature_2m_min?.[1] ?? null,
      maxima: daily.temperature_2m_max?.[1] ?? null,
      lluvia: daily.precipitation_sum?.[1] ?? null,
      probabilidad: daily.precipitation_probability_max?.[1] ?? null,
      viento: daily.wind_speed_10m_max?.[1] ?? null,
    } : null,
    temperatura: current.temperature_2m,
    humedad: current.relative_humidity_2m,
    precipitacion: current.precipitation,
    viento: current.wind_speed_10m,
  };
};

/**
 * Guarda una evaluación climática en el historial (JSON Server - POST).
 * @param {Object} evaluacion - Datos de la evaluación a guardar
 * @returns {Object} Registro guardado con id asignado
 */
export const saveEvaluation = async (evaluacion) => {
  const response = await fetch(DB_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...evaluacion,
      fecha: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Error al guardar la evaluación en el historial.");
  }

  return await response.json();
};

/**
 * Obtiene el historial completo de evaluaciones desde JSON Server (GET).
 * @returns {Array} Lista de evaluaciones guardadas
 */
export const getHistory = async () => {
  const response = await fetch(DB_URL);

  if (!response.ok) {
    throw new Error("Error al obtener el historial.");
  }

  return await response.json();
};
