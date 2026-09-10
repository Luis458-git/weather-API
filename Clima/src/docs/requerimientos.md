# Weather Activity Dashboard

Quiero que desarrolles una aplicación completa en **React + Vite** siguiendo buenas prácticas de programación, componentes reutilizables y una arquitectura limpia.

## Objetivo

Consumir la API pública de Open-Meteo para evaluar automáticamente si una actividad al aire libre puede realizarse según las condiciones climáticas.

API:

https://api.open-meteo.com/v1/forecast?latitude=9.9981&longitude=-84.1169&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m

---

# Estructura del proyecto

Crear la siguiente estructura:

* components/
* services/
* utils/
* styles/
* assets/

Componentes:

* Header
* WeatherCard
* RiskCard
* EvaluationDetail
* BusinessRules

---

# Funcionalidades

Implementar:

* Consumir la API utilizando **fetch**, **async/await** y **useEffect**.
* Mostrar:

  * Temperatura
  * Humedad
  * Precipitación
  * Velocidad del viento
* Evaluar automáticamente el clima.
* Mostrar una recomendación:

  * 🟢 Realizar
  * 🟡 Precaución
  * 🔴 Reprogramar
* Mostrar la explicación del resultado.
* Agregar un botón **Actualizar clima**.
* Manejar estados de carga.
* Manejar errores.
* Separar completamente la lógica de negocio de la interfaz.
* Utilizar componentes reutilizables.
* Utilizar props correctamente.
* Comentar el código cuando sea necesario.

---

# Reglas de negocio

Temperatura

* 15–30°C → Realizar
* 10–14°C o 31–34°C → Precaución
* <10°C o ≥35°C → Reprogramar

Precipitación

* 0 mm → Realizar
* 0.1–4.9 mm → Precaución
* ≥5 mm → Reprogramar

Viento

* <20 km/h → Realizar
* 20–39 km/h → Precaución
* ≥40 km/h → Reprogramar

Lógica final:

* Si alguna condición es **Reprogramar**, el resultado final será **Reprogramar**.
* Si ninguna es Reprogramar pero alguna es Precaución, el resultado será Precaución.
* Si todas son favorables, el resultado será Realizar.

---

# Dashboard

Crear un dashboard moderno y responsive que incluya:

* Header con el nombre de la aplicación.
* Tarjetas para:

  * Temperatura
  * Humedad
  * Precipitación
  * Viento
* Tarjeta principal con:

  * Nivel de riesgo
  * Recomendación
* Panel con la explicación de cada variable.
* Panel con las reglas utilizadas.
* Iconos.
* Colores según el nivel de riesgo.
* Diseño moderno utilizando CSS.

---

# db.json

Crear un archivo **db.json** compatible con JSON Server para almacenar un historial de evaluaciones.

Cada registro debe contener:

* id
* fecha
* temperatura
* humedad
* precipitacion
* viento
* riesgo
* recomendacion

Implementar las operaciones necesarias para guardar y consultar el historial (GET y POST).

---

# Entrega

Generar todos los archivos completos, funcionales y organizados.

No dejar archivos vacíos.

Mantener una arquitectura limpia.

---

# ✅ Checklist (Marcar con X cuando esté completado)

## Estructura

[X] Crear carpetas (components, services, utils, styles, assets)

[X] Crear todos los componentes

[X] Crear weatherService.js

[X] Crear evaluateWeather.js

[X] Crear App.jsx

[X] Crear estilos CSS

---

## API

[X] Consumir Open-Meteo

[X] Usar fetch

[X] Usar async/await

[X] Usar useEffect

[X] Manejar errores

[X] Manejar carga

---

## Dashboard

[X] Mostrar temperatura

[X] Mostrar humedad

[X] Mostrar precipitación

[X] Mostrar viento

[X] Mostrar riesgo

[X] Mostrar recomendación

[X] Mostrar explicación

[X] Botón Actualizar clima

[X] Diseño responsive

---

## Reglas

[X] Implementar reglas de temperatura

[X] Implementar reglas de lluvia

[X] Implementar reglas de viento

[X] Calcular correctamente el riesgo final

---

## JSON Server

[X] Crear db.json

[X] Implementar GET

[X] Implementar POST

[X] Guardar historial

---

## Código

[X] Código organizado

[X] Componentes reutilizables

[X] Uso correcto de props

[X] Separación entre lógica e interfaz

[X] Código comentado cuando sea necesario

[X] Proyecto completamente funcional

Al finalizar, marca cada elemento completado con **[X]** y deja **[ ]** en los que no hayas implementado.
