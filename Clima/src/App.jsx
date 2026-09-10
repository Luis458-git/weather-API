import { Fragment, useState, useEffect, useCallback } from 'react';

// Importar componentes
import Header from './Components/header';
import WeatherCard from './Components/WeatherCard';
import RiskCard from './Components/RiskCard';
import EvaluationDetail from './Components/EvaluationDetail';
import BusinessRules from './Components/BusinessRules';
import { ActivityAdvice, Forecast, HistoryDetail } from './Components/WeatherOutlook';

// Importar servicios y lógica de negocio
import { getWeatherData, saveEvaluation, getHistory, REGIONES } from './services/weatherService';
import { evaluarClima, NIVEL_CLASS } from './utils/evaluateWeather';

// Importar estilos
import './styles/Dashboard.css';

/**
 * App.jsx
 * Componente raíz de la aplicación Weather Activity Dashboard.
 *
 * Responsabilidades:
 * - Gestionar el estado global: datos del clima, evaluación, historial, carga y errores.
 * - Orquestar la obtención de datos climáticos y guardado del historial.
 * - Pasar props correctas a cada componente hijo.
 */

// Configuración de las WeatherCards: cómo mapear datos a la UI
const CARD_CONFIG = [
  {
    key: 'temperatura',
    detailKey: 'temperatura',
    label: 'Temperatura',
    unit: '°C',
    icon: '🌡️',
    color: '#f97316',
  },
  {
    key: 'humedad',
    detailKey: null, // La humedad no tiene regla de evaluación, se muestra solo
    label: 'Humedad',
    unit: '%',
    icon: '💧',
    color: '#38bdf8',
  },
  {
    key: 'precipitacion',
    detailKey: 'precipitacion',
    label: 'Precipitación',
    unit: 'mm',
    icon: '🌧️',
    color: '#818cf8',
  },
  {
    key: 'viento',
    detailKey: 'viento',
    label: 'Viento',
    unit: 'km/h',
    icon: '💨',
    color: '#34d399',
  },
];

function App() {
  const [region, setRegion] = useState(REGIONES[0]);
  const [registroAbierto, setRegistroAbierto] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  // ── Estado del clima actual obtenido de la API ──
  const [weatherData, setWeatherData] = useState(null);

  // ── Resultado de la evaluación climática ──
  const [evaluacion, setEvaluacion] = useState(null);

  // ── Historial de evaluaciones guardadas ──
  const [historial, setHistorial] = useState([]);

  // ── Estado de carga ──
  const [loading, setLoading] = useState(true);

  // ── Mensaje de error ──
  const [error, setError] = useState(null);

  // ── Estado de guardado en historial ──
  const [guardando, setGuardando] = useState(false);

  /**
   * Carga los datos del clima desde la API, evalúa las condiciones
   * y guarda el resultado en el historial (JSON Server).
   * Implementa async/await + manejo de errores.
   */
  const fetchAndEvaluate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Obtener datos de la API de Open-Meteo
      const datos = await getWeatherData(region);
      setWeatherData(datos);

      // 2. Evaluar clima con la lógica de negocio (separada de la UI)
      const resultado = evaluarClima(datos);
      setEvaluacion(resultado);

      // 3. Guardar en el historial (JSON Server) en segundo plano
      setGuardando(true);
      try {
        setHistoryError(null);
        await saveEvaluation({
          region: datos.region,
          manana: datos.manana,
          temperatura: datos.temperatura,
          humedad: datos.humedad,
          precipitacion: datos.precipitacion,
          viento: datos.viento,
          riesgo: resultado.nivelFinal,
          recomendacion: resultado.emoji + ' ' + resultado.nivelFinal,
        });

        // Recargar historial
        const nuevoHistorial = await getHistory();
        setHistorial(nuevoHistorial);
      } catch (histError) {
        // El error del historial no bloquea la funcionalidad principal
        console.warn('No se pudo guardar el historial:', histError.message);
        setHistoryError('No se pudo guardar la evaluación. Comprueba que el servidor del historial esté encendido (npm run server).');
      } finally {
        setGuardando(false);
      }
    } catch (err) {
      // Error principal: no se pudo obtener el clima
      setError(err.message || 'Error desconocido al obtener el clima.');
    } finally {
      setLoading(false);
    }
  }, [region]);

  /**
   * Cargar historial desde JSON Server al montar la app.
   */
  const fetchHistory = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistorial(data);
    } catch {
      setHistoryError('No se pudo cargar el historial. Comprueba que el servidor esté encendido (npm run server).');
      // Si JSON Server no está corriendo, ignorar silenciosamente
    }
  }, []);

  // Ejecutar al montar el componente (useEffect con async/await)
  useEffect(() => {
    // Cancelar el inicio si el efecto se desmonta antes de consultar la API.
    const timer = setTimeout(() => { fetchAndEvaluate(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchAndEvaluate]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchHistory(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchHistory]);

  const regionSelector = <label className="region-selector">
    Región
    <select value={region.id} disabled={loading || guardando} onChange={event => {
      setLoading(true);
      setRegistroAbierto(null);
      setRegion(REGIONES.find(item => item.id === event.target.value));
    }}>
      {REGIONES.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
    </select>
  </label>;

  // ── Renderizado de estado de carga ──
  if (loading) {
    return (
      <>
        <Header />
        <div className="status-container">
          <div className="loading-spinner" role="status" aria-label="Cargando datos del clima" />
          <p className="status-title">Obteniendo datos del clima...</p>
          <p className="status-message">Consultando la API de Open-Meteo en tiempo real.</p>
        </div>
      </>
    );
  }

  // ── Renderizado de error ──
  if (error) {
    return (
      <>
        <Header />
        <div className="status-container">
          <span className="status-icon" role="img" aria-label="Error">⚠️</span>
          <p className="status-title">No se pudo obtener el clima</p>
          <p className="status-message">{error}</p>
          {regionSelector}
          <button
            id="btn-retry"
            className="btn-refresh"
            onClick={fetchAndEvaluate}
            aria-label="Reintentar la carga del clima"
          >
            🔄 Reintentar
          </button>
        </div>
      </>
    );
  }

  // ── Renderizado principal del dashboard ──
  return (
    <>
      {/* ── Elementos de animación de fondo ── */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />
      <div className="bg-orb bg-orb-4" aria-hidden="true" />
      <div className="bg-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span className="particle" key={i} />
        ))}
      </div>

      {/* Componente de encabezado */}
      <Header />

      <main className="dashboard">
        {/* Fila superior: localización + botón actualizar */}
        <div className="dashboard-intro">
          <div className="dashboard-location">
            <span aria-hidden="true">📍</span>
            <span>{region.nombre} — </span>
            <strong>Lat {region.latitude} · Lon {region.longitude}</strong>
          </div>

          <button
            id="btn-refresh-weather"
            className="btn-refresh"
            onClick={fetchAndEvaluate}
            disabled={loading || guardando}
            aria-label="Actualizar datos del clima"
          >
            {/* Spinner inline cuando está cargando */}
            {loading ? (
              <svg
                className="spinner"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <span aria-hidden="true">🔄</span>
            )}
            Actualizar clima
          </button>
        </div>

        {/* ── Tarjetas de variables climáticas ── */}
        {regionSelector}
        <div className="weather-grid">
          {CARD_CONFIG.map(({ key, detailKey, label, unit, icon, color }) => {
            // Obtener el nivel evaluado para la variable (si aplica)
            const detalle = detailKey && evaluacion
              ? evaluacion.detalles[detailKey]
              : null;
            const nivel = detalle ? detalle.nivel : 'Realizar';
            const clase = detalle ? NIVEL_CLASS[nivel] : 'realizar';

            return (
              <WeatherCard
                key={key}
                label={label}
                value={weatherData[key]}
                unit={unit}
                icon={icon}
                nivel={nivel}
                clase={clase}
                color={color}
              />
            );
          })}
        </div>

        {/* ── Sección inferior: RiskCard + EvaluationDetail + BusinessRules ── */}
        {evaluacion && (
          <div className="dashboard-bottom">
            {/* Tarjeta de resultado final */}
            <RiskCard
              nivelFinal={evaluacion.nivelFinal}
              emoji={evaluacion.emoji}
              clase={evaluacion.clase}
              detalles={evaluacion.detalles}
            />

            {/* Panel de explicación detallada */}
            <EvaluationDetail detalles={evaluacion.detalles} />

            {/* Panel de reglas utilizadas */}
            <BusinessRules />
          </div>
        )}

        {/* ── Historial de evaluaciones ── */}
        <ActivityAdvice datos={weatherData} />
        <Forecast datos={weatherData.manana} />
        <div className="history-section">
          <p className="panel-title">
            🗂️ Historial de evaluaciones
            {guardando && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '0.5rem' }}>
                Guardando...
              </span>
            )}
          </p>

          {historyError && <p role="status" className="outlook-note">{historyError}</p>}
          <p className="outlook-note">Pulsa Ver detalles para consultar el clima registrado, las actividades y el pronóstico guardado.</p>
          {historial.length === 0 ? (
            <p className="history-empty">
              No hay registros aún. Los datos se guardan automáticamente al cargar el clima.
            </p>
          ) : (
            <div className="history-table-wrap">
              <table className="history-table" aria-label="Historial de evaluaciones climáticas">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Región</th>
                    <th>Temp. (°C)</th>
                    <th>Humedad (%)</th>
                    <th>Precip. (mm)</th>
                    <th>Viento (km/h)</th>
                    <th>Riesgo</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mostrar las últimas 10 evaluaciones */}
                  {[...historial].reverse().slice(0, 10).map((reg) => (
                    <Fragment key={reg.id}>
                    <tr>
                      <td>{new Date(reg.fecha).toLocaleString('es-CR')}</td>
                      <td>{reg.region?.nombre || 'San José, Costa Rica'}</td>
                      <td>{reg.temperatura}</td>
                      <td>{reg.humedad}</td>
                      <td>{reg.precipitacion}</td>
                      <td>{reg.viento}</td>
                      <td>
                        <span className={`history-badge ${NIVEL_CLASS[reg.riesgo]}`}>
                          {reg.recomendacion}
                        </span>
                      </td>
                      <td><button className="btn-refresh" aria-expanded={registroAbierto === reg.id}
                        aria-controls={`detalle-${reg.id}`} onClick={() => setRegistroAbierto(registroAbierto === reg.id ? null : reg.id)}>
                        {registroAbierto === reg.id ? 'Ocultar detalles' : 'Ver detalles'}
                      </button></td>
                    </tr>
                    <tr hidden={registroAbierto !== reg.id} id={`detalle-${reg.id}`}>
                      <td colSpan={8}>{registroAbierto === reg.id && <HistoryDetail registro={reg} />}</td>
                    </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
