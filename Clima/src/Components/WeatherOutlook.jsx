import { evaluarClima } from '../utils/evaluateWeather';
import EvaluationDetail from './EvaluationDetail';

export function ActivityAdvice({ datos }) {
  const consejos = [];
  if (datos.precipitacion >= 5) consejos.push('Reprogramar caminatas, ciclismo y deportes en canchas descubiertas por la lluvia intensa.');
  else if (datos.precipitacion > 0) consejos.push('Evitar picnics sin techo y recorridos por superficies resbaladizas; prever una alternativa cubierta.');
  if (datos.viento >= 40) consejos.push('Reprogramar ciclismo, campamentos y actividades con estructuras ligeras por el viento fuerte.');
  else if (datos.viento >= 20) consejos.push('Evitar actividades con objetos ligeros y tener precaución al montar carpas.');
  if (datos.temperatura > 34 || datos.temperatura < 10) consejos.push('Reprogramar ejercicio intenso y excursiones prolongadas por la temperatura extrema según las reglas de esta aplicación.');
  else if (datos.temperatura > 30 || datos.temperatura < 15) consejos.push('Reducir la duración de carreras y entrenamientos al aire libre por la temperatura.');
  return <section className="activity-advice">
    <h3>Actividades a evitar o adaptar</h3>
    {consejos.length ? <ul>{consejos.map(texto => <li key={texto}>{texto}</li>)}</ul>
      : <p>Estas mediciones no activan restricciones de la aplicación para caminar, hacer un picnic o practicar deportes al aire libre.</p>}
    <p className="outlook-note">Orientación basada en temperatura, lluvia y viento; no representa una prohibición oficial.</p>
  </section>;
}

export function Forecast({ datos, historico = false }) {
  if (!datos) return <section className="forecast-panel"><h3>Pronóstico {historico ? 'guardado' : 'para mañana'}</h3><p>No hay pronóstico disponible{historico ? ' en este registro' : ''}.</p></section>;
  const mostrar = (valor, unidad) => Number.isFinite(valor) ? `${valor} ${unidad}` : 'No disponible';
  return <section className="forecast-panel">
    <h3>{historico ? 'Pronóstico guardado para el día siguiente' : 'Qué puede pasar mañana'} · {datos.fecha}</h3>
    <div className="forecast-values">
      <p>Mínima / máxima<strong>{mostrar(datos.minima, '°C')} / {mostrar(datos.maxima, '°C')}</strong></p>
      <p>Probabilidad máxima de lluvia<strong>{mostrar(datos.probabilidad, '%')}</strong></p>
      <p>Lluvia acumulada del día<strong>{mostrar(datos.lluvia, 'mm')}</strong></p>
      <p>Viento máximo<strong>{mostrar(datos.viento, 'km/h')}</strong></p>
    </div>
    <ul>
      {datos.probabilidad >= 50 && <li>Podría llover: prever un lugar cubierto para picnics, caminatas o deportes.</li>}
      {datos.lluvia > 0 && <li>Se prevé precipitación durante el día; los recorridos podrían estar mojados.</li>}
      {datos.viento >= 20 && <li>Se espera viento moderado o fuerte: revisar los planes de ciclismo y campamento.</li>}
      {(Number.isFinite(datos.minima) && datos.minima < 15 || datos.maxima > 30) && <li>Podría haber frío o calor fuera del rango ideal de la aplicación: adaptar la hora y duración de las actividades.</li>}
    </ul>
    <p className="outlook-note">{historico ? 'Esta previsión se obtuvo al guardar la evaluación; no es el pronóstico actualizado de mañana.' : 'La previsión puede cambiar. Los valores son resúmenes diarios y no indican a qué hora ocurrirá cada condición.'}</p>
    <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Datos: Open-Meteo</a>
  </section>;
}

export function HistoryDetail({ registro }) {
  const resultado = evaluarClima(registro);
  return <div className="history-detail">
    <h3>Clima registrado · {registro.region?.nombre || 'San José, Costa Rica (registro anterior)'}</h3>
    <p>{new Date(registro.fecha).toLocaleString('es-CR')} · Humedad: {registro.humedad} %</p>
    <EvaluationDetail detalles={resultado.detalles} />
    <ActivityAdvice datos={registro} />
    <Forecast datos={registro.manana} historico />
  </div>;
}
