# 🏆 100 Metodólogos Dijeron

Juego de preguntas estilo **"100 Mexicanos Dijeron"** (formato *Family Feud*) pensado para repasar, en equipo y de forma dinámica, los conceptos clave de la **Metodología de la Investigación**.

En vez de responder con la única opción "correcta", cada pregunta tiene varias respuestas válidas ordenadas por popularidad/puntaje (como en el programa de TV). El equipo debe ir adivinando la mayor cantidad posible antes de acumular 3 strikes ❌❌❌.

## 🗂️ Índice

- [💡 ¿Qué es este proyecto?](#-qué-es-este-proyecto)
- [🎓 Contexto académico](#-contexto-académico)
- [📜 Reglas del juego](#-reglas-del-juego)
- [📚 Temas que cubre](#-temas-que-cubre)
- [🕹️ Cómo jugar](#-cómo-jugar)
- [📂 Estructura del proyecto](#-estructura-del-proyecto)
- [🛠️ Tecnologías utilizadas](#-tecnologías-utilizadas)
- [📖 Fuentes consultadas](#-fuentes-consultadas)
- [⚖️ Licencia](#-licencia)

## 💡 ¿Qué es este proyecto?

Es una herramienta de estudio gamificada: convierte un repaso teórico (que normalmente sería una lista de definiciones) en una dinámica de preguntas y respuestas con puntaje ⭐, tensión (los strikes ❌) y una "regla de robo", igual que el programa televisivo en el que está inspirado.

La idea pedagógica detrás es sencilla: recordar activamente una respuesta (en vez de solo leerla) ayuda a fijar mejor el conocimiento, y competir en equipos hace que el repaso sea más ameno antes de una exposición o un examen.

## 🎓 Contexto académico

- 📘 **Materia:** Metodología de la Investigación y Divulgación Científica
- 🔍 **Temas fuente:** 1.3.2 Dimensiones de la investigación y 1.3.3 Métodos generales de la investigación
- 🎯 **Uso previsto:** actividad de repaso grupal antes de una exposición en clase

## 📜 Reglas del juego

1. 👥 Se forman **2 equipos**.
2. 🔟 La partida consta de **10 rondas**, una por cada pregunta.
3. 🗣️ En cada ronda, los equipos van diciendo respuestas que crean que están en el tablero.
4. ❌ Cada respuesta **incorrecta** suma un **strike**. Al llegar a **3 strikes**, el equipo contrario puede arriesgar 🔁 **una sola respuesta** para "robar" todos los puntos acumulados en esa ronda.
5. ⭐ Los puntos de las respuestas correctas se van sumando durante la ronda y se **consolidan al terminar** (ya sea porque se descubrió el tablero completo o porque hubo un robo).
6. 🏆 Gana el equipo con más puntos acumulados al final de las 10 rondas.

## 📚 Temas que cubre

Cada ronda corresponde a una pregunta con varias respuestas posibles, ordenadas de mayor a menor puntaje:

| Ronda | Tema | Pregunta |
|---|------|----------|
| 1️⃣ | Sirvent · Los 3 planos | Una de las tres dimensiones del proceso metodológico según María Teresa Sirvent |
| 2️⃣ | Sirvent · Dimensión epistemológica | Un componente de la dimensión epistemológica |
| 3️⃣ | Tipos por profundidad | Un tipo de investigación según su profundidad o alcance |
| 4️⃣ | Métodos lógicos/teóricos | Un método lógico o teórico de la investigación |
| 5️⃣ | Orozco Livia · Las 3 dimensiones | Una de las tres dimensiones de la metodología según Víctor Orozco Livia |
| 6️⃣ | Criterios de clasificación | Un criterio para clasificar tipos de investigación |
| 7️⃣ | Métodos empíricos | Un método empírico de investigación |
| 8️⃣ | Técnicas cualitativas | Una técnica cualitativa de obtención de información |
| 9️⃣ | Métodos estructurales | Un método estructural o de tránsito conceptual |
| 🔟 | Orozco · Presupuestos ex-ante | Un presupuesto ex-ante según Orozco Livia |

El detalle completo de cada respuesta —incluyendo su explicación conceptual y la cita bibliográfica de la que proviene— vive en [`respuestas.json`](respuestas.json), que funciona como la "fuente de la verdad" del contenido académico del juego.

## 🕹️ Cómo jugar

Hay dos versiones del mismo juego, pensadas para necesidades distintas:

### 🌐 Opción 1 — Versión HTML (recomendada para presentar en clase)

Es un archivo **autocontenido**: no necesita instalar nada, ni servidor, ni conexión a internet (salvo para cargar las tipografías de Google Fonts).

1. Descarga o clona el repositorio.
2. Haz doble clic en [`100-metodologos-dijeron.html`](100-metodologos-dijeron.html) para abrirlo con tu navegador.
3. Proyecta la pantalla y ¡a jugar! 🎉

### ⚛️ Opción 2 — Versión React (para integrarlo en otro proyecto)

[`100-metodologos-dijeron.jsx`](100-metodologos-dijeron.jsx) exporta un componente `Game` listo para usarse dentro de cualquier proyecto React (Vite, Create React App, Next.js, etc.):

```bash
npm create vite@latest mi-juego -- --template react
cd mi-juego
npm install
```

Copia el archivo `100-metodologos-dijeron.jsx` dentro de `src/`, e impórtalo en tu `App.jsx`:

```jsx
import Game from "./100-metodologos-dijeron.jsx";

export default function App() {
  return <Game />;
}
```

El componente maneja todo su propio estado (ronda actual, strikes, puntaje, etc.) con los hooks de React, así que no requiere props ni configuración adicional.

## 📂 Estructura del proyecto

```
.
├── 🎮 100-metodologos-dijeron.html   # Versión standalone jugable (HTML + CSS + JS vanilla)
├── ⚛️ 100-metodologos-dijeron.jsx    # Versión como componente de React
├── 🗃️ respuestas.json                # Fuente de contenido: preguntas, respuestas, puntajes,
│                                      # explicaciones y referencias bibliográficas
└── 📖 README.md
```

> 💡 Nota: las dos versiones jugables (HTML y JSX) incluyen cada una su propio arreglo de preguntas y respuestas de forma independiente; `respuestas.json` es la referencia "ampliada" con las explicaciones y fuentes que sustentan cada respuesta.

## 🛠️ Tecnologías utilizadas

- 🌐 **HTML5 + CSS3 + JavaScript vanilla** — versión standalone, sin dependencias ni build step.
- ⚛️ **React** (hooks: `useState`, `useCallback`, `useEffect`, `useRef`) — versión componente.
- 🗃️ **JSON** — estructura de datos para el contenido académico y sus referencias.

## 📖 Fuentes consultadas

El contenido de las preguntas está basado en:

- 📘 M. T. Sirvent y L. Rigal, *La investigación social en educación*, Miño y Dávila, 2010.
- 📘 V. Orozco Livia, «Dimensiones de la Metodología de Investigación», *Pensamiento Crítico*, no. 7, pp. 13-20, 2007.
- 📘 S. Hernández y D. Duana, «Métodos teóricos de la investigación», Universidad Autónoma del Estado de Hidalgo, 2018.
- 📘 F. N. Rodríguez C., «Generalidades acerca de las técnicas de investigación cuantitativa», *Paradigmas*, 2007.

## ⚖️ Licencia

🚧 Por definir — próximamente se agregará una licencia de código abierto.
