import { useState, useCallback, useEffect, useRef } from "react";

const ROUNDS = [
  {
    question: "Mencione una de las TRES DIMENSIONES del modelo de María Teresa Sirvent",
    answers: [
      { text: "Epistemológica", points: 40 },
      { text: "Estrategia general", points: 35 },
      { text: "Técnicas de obtención y análisis", points: 25 },
    ],
  },
  {
    question: "Mencione un COMPONENTE de la dimensión epistemológica de Sirvent",
    answers: [
      { text: "Planteamiento del problema", points: 25 },
      { text: "Hipótesis", points: 22 },
      { text: "Marco teórico / Encuadre conceptual", points: 20 },
      { text: "Objetivos de la investigación", points: 18 },
      { text: "Delimitación del objeto de estudio", points: 10 },
      { text: "Relevancia científica y social", points: 5 },
    ],
  },
  {
    question: "Mencione un TIPO de investigación según su PROFUNDIDAD o alcance",
    answers: [
      { text: "Descriptiva", points: 28 },
      { text: "Exploratoria", points: 25 },
      { text: "Explicativa", points: 22 },
      { text: "Correlacional", points: 15 },
      { text: "Etnográfica", points: 10 },
    ],
  },
  {
    question: "Mencione un MÉTODO LÓGICO o TEÓRICO de investigación",
    answers: [
      { text: "Hipotético-deductivo", points: 30 },
      { text: "Inductivo-deductivo", points: 25 },
      { text: "Analítico-sintético", points: 22 },
      { text: "Inductivo", points: 13 },
      { text: "Deductivo", points: 10 },
    ],
  },
  {
    question: "Mencione una DIMENSIÓN del modelo de Víctor Orozco Livia",
    answers: [
      { text: "Presupuestos ex-ante", points: 35 },
      { text: "Lineamientos de la investigación", points: 35 },
      { text: "Método de exposición", points: 30 },
    ],
  },
  {
    question: "Mencione un CRITERIO para CLASIFICAR tipos de investigación",
    answers: [
      { text: "Profundidad", points: 25 },
      { text: "Medición (cuanti/cuali/mixta)", points: 22 },
      { text: "Manejo de variables", points: 18 },
      { text: "Fuente de obtención de datos", points: 15 },
      { text: "Extensión", points: 12 },
      { text: "Objetivos (básica/aplicada)", points: 8 },
    ],
  },
  {
    question: "Mencione un MÉTODO EMPÍRICO de investigación",
    answers: [
      { text: "Experimental", points: 40 },
      { text: "Observacional", points: 35 },
      { text: "Análisis de contenido", points: 25 },
    ],
  },
  {
    question: "Mencione una TÉCNICA CUALITATIVA de obtención de información",
    answers: [
      { text: "Entrevista en profundidad", points: 30 },
      { text: "Observación participante", points: 28 },
      { text: "Registros etnográficos de campo", points: 22 },
      { text: "Recopilación documental / de archivo", points: 20 },
    ],
  },
  {
    question: "Mencione un MÉTODO ESTRUCTURAL o de tránsito conceptual",
    answers: [
      { text: "Histórico-lógico", points: 28 },
      { text: "Abstracto-concreto", points: 25 },
      { text: "Sistémico-estructural-funcional", points: 22 },
      { text: "Genético", points: 15 },
      { text: "Modelación", points: 10 },
    ],
  },
  {
    question: "Mencione un PRESUPUESTO EX-ANTE según Orozco Livia",
    answers: [
      { text: "Principios filosóficos", points: 30 },
      { text: "Principios epistemológicos", points: 28 },
      { text: "Concepción científica del mundo", points: 22 },
      { text: "Ideología del investigador", points: 20 },
    ],
  },
];

const XMark = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" stroke="#ef4444" strokeWidth="3" />
    <line x1="16" y1="16" x2="32" y2="32" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="16" x2="16" y2="32" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function checkMatch(input, answer) {
  const ni = normalize(input);
  const na = normalize(answer);
  if (!ni) return false;
  if (na.includes(ni) || ni.includes(na)) return true;
  const iWords = ni.split(/\s+/);
  const aWords = na.split(/\s+/);
  const matchCount = iWords.filter((w) =>
    aWords.some((aw) => aw.includes(w) || w.includes(aw))
  ).length;
  return matchCount >= Math.max(1, Math.ceil(aWords.length * 0.4));
}

export default function Game() {
  const [screen, setScreen] = useState("title");
  const [roundIdx, setRoundIdx] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [strikes, setStrikes] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showStrike, setShowStrike] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [flipIdx, setFlipIdx] = useState(-1);
  const inputRef = useRef(null);

  const round = ROUNDS[roundIdx];
  const maxStrikes = 3;

  useEffect(() => {
    if (screen === "round" && inputRef.current && !roundOver) {
      inputRef.current.focus();
    }
  }, [screen, roundOver, feedback]);

  const startGame = () => {
    setScreen("round");
    setRoundIdx(0);
    setRevealed([]);
    setStrikes(0);
    setInput("");
    setScore(0);
    setTotalScore(0);
    setFeedback(null);
    setRoundOver(false);
    setRevealAll(false);
    setShowStrike(false);
  };

  const handleGuess = useCallback(() => {
    if (!input.trim() || roundOver) return;
    const guess = input.trim();
    setInput("");

    let matchIdx = -1;
    for (let i = 0; i < round.answers.length; i++) {
      if (!revealed.includes(i) && checkMatch(guess, round.answers[i].text)) {
        matchIdx = i;
        break;
      }
    }

    if (matchIdx >= 0) {
      const pts = round.answers[matchIdx].points;
      const newRevealed = [...revealed, matchIdx];
      setRevealed(newRevealed);
      setScore((s) => s + pts);
      setFlipIdx(matchIdx);
      setFeedback({ type: "correct", text: `¡${round.answers[matchIdx].text}! +${pts} pts` });
      setTimeout(() => setFlipIdx(-1), 600);

      if (newRevealed.length === round.answers.length) {
        setFeedback({ type: "perfect", text: "¡TODAS LAS RESPUESTAS!" });
        setRoundOver(true);
      }
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setShowStrike(true);
      setTimeout(() => setShowStrike(false), 800);
      setFeedback({ type: "wrong", text: `¡STRIKE ${newStrikes}!` });
      if (newStrikes >= maxStrikes) {
        setRoundOver(true);
        setRevealAll(true);
      }
    }
  }, [input, roundOver, round, revealed, strikes]);

  const nextRound = () => {
    const newTotal = totalScore + score;
    setTotalScore(newTotal);
    if (roundIdx + 1 >= ROUNDS.length) {
      setTotalScore(newTotal);
      setScreen("end");
    } else {
      setRoundIdx(roundIdx + 1);
      setRevealed([]);
      setStrikes(0);
      setInput("");
      setScore(0);
      setFeedback(null);
      setRoundOver(false);
      setRevealAll(false);
      setShowStrike(false);
    }
  };

  const finalScore = totalScore + score;

  const getGrade = () => {
    const max = ROUNDS.reduce((s, r) => s + r.answers.reduce((a, b) => a + b.points, 0), 0);
    const pct = finalScore / max;
    if (pct >= 0.85) return { emoji: "🏆", msg: "¡ERES EL MERO MERO de la Metodología!" };
    if (pct >= 0.65) return { emoji: "🎓", msg: "¡Muy bien! Dominas los conceptos clave." };
    if (pct >= 0.40) return { emoji: "📚", msg: "Vas por buen camino, a repasar un poco más." };
    return { emoji: "💪", msg: "¡A darle con más ganas al estudio!" };
  };

  // --- STYLES ---
  const colors = {
    bg: "#0a0e27",
    panel: "#111640",
    gold: "#f5c518",
    goldDark: "#c49b00",
    blue: "#1e3a8a",
    blueBright: "#3b82f6",
    green: "#22c55e",
    red: "#ef4444",
    white: "#f8fafc",
    muted: "#94a3b8",
    boardBg: "#0c1445",
    answerHidden: "#162058",
    answerRevealed: "#1e3a8a",
  };

  const styles = {
    root: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bg} 0%, #0f1a4a 100%)`,
      color: colors.white,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px 16px",
    },
    title: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      minHeight: "80vh",
    },
    logo: {
      fontSize: "clamp(1.8rem, 5vw, 3rem)",
      fontWeight: 900,
      color: colors.gold,
      textShadow: `0 2px 12px rgba(245,197,24,0.3)`,
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    subtitle: {
      fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
      color: colors.muted,
      maxWidth: 420,
      lineHeight: 1.5,
    },
    btn: {
      background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
      color: "#0a0e27",
      border: "none",
      borderRadius: 12,
      padding: "14px 36px",
      fontSize: "1.05rem",
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: "0.02em",
      transition: "transform 0.15s, box-shadow 0.15s",
      boxShadow: "0 4px 16px rgba(245,197,24,0.25)",
    },
    topBar: {
      width: "100%",
      maxWidth: 680,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      flexWrap: "wrap",
      gap: 8,
    },
    badge: {
      background: colors.panel,
      borderRadius: 8,
      padding: "6px 14px",
      fontSize: "0.82rem",
      fontWeight: 600,
      border: `1px solid rgba(255,255,255,0.08)`,
    },
    scoreBadge: {
      background: `linear-gradient(135deg, ${colors.gold}22, ${colors.goldDark}11)`,
      border: `1px solid ${colors.gold}44`,
      color: colors.gold,
    },
    question: {
      background: colors.panel,
      border: `2px solid ${colors.gold}55`,
      borderRadius: 16,
      padding: "18px 22px",
      fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
      fontWeight: 600,
      textAlign: "center",
      maxWidth: 680,
      width: "100%",
      marginBottom: 16,
      lineHeight: 1.45,
    },
    board: {
      width: "100%",
      maxWidth: 680,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: 18,
    },
    answerRow: (isRevealed, isFlipping) => ({
      display: "flex",
      alignItems: "center",
      background: isRevealed
        ? `linear-gradient(90deg, ${colors.answerRevealed}, #234099)`
        : colors.answerHidden,
      borderRadius: 10,
      padding: "12px 16px",
      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: isFlipping ? "rotateX(360deg) scale(1.03)" : "rotateX(0deg) scale(1)",
      border: isRevealed
        ? `1px solid ${colors.blueBright}66`
        : "1px solid rgba(255,255,255,0.05)",
      boxShadow: isRevealed ? `0 2px 12px rgba(59,130,246,0.15)` : "none",
    }),
    answerNum: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.8rem",
      fontWeight: 700,
      marginRight: 14,
      flexShrink: 0,
    },
    answerText: {
      flex: 1,
      fontSize: "clamp(0.88rem, 2vw, 1rem)",
      fontWeight: 500,
    },
    answerPts: {
      background: colors.gold,
      color: "#0a0e27",
      borderRadius: 6,
      padding: "3px 10px",
      fontSize: "0.82rem",
      fontWeight: 800,
      marginLeft: 10,
      flexShrink: 0,
    },
    hiddenLabel: {
      flex: 1,
      fontSize: "0.9rem",
      color: "rgba(255,255,255,0.2)",
      fontWeight: 600,
      letterSpacing: "0.15em",
    },
    strikesArea: {
      display: "flex",
      gap: 8,
      justifyContent: "center",
      marginBottom: 14,
    },
    strikeX: (active) => ({
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: active ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
      border: active ? `2px solid ${colors.red}` : "2px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.1rem",
      fontWeight: 900,
      color: active ? colors.red : "rgba(255,255,255,0.1)",
      transition: "all 0.3s",
    }),
    inputArea: {
      display: "flex",
      gap: 10,
      width: "100%",
      maxWidth: 680,
    },
    input: {
      flex: 1,
      background: "rgba(255,255,255,0.06)",
      border: "2px solid rgba(255,255,255,0.12)",
      borderRadius: 10,
      padding: "12px 16px",
      fontSize: "1rem",
      color: colors.white,
      outline: "none",
      transition: "border-color 0.2s",
    },
    sendBtn: {
      background: colors.blueBright,
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "12px 20px",
      fontSize: "0.95rem",
      fontWeight: 700,
      cursor: "pointer",
      flexShrink: 0,
    },
    feedbackBar: (type) => ({
      textAlign: "center",
      padding: "10px 0",
      fontSize: "1rem",
      fontWeight: 700,
      color:
        type === "correct"
          ? colors.green
          : type === "perfect"
          ? colors.gold
          : colors.red,
      minHeight: 40,
      transition: "color 0.2s",
    }),
    overlay: {
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.65)",
      zIndex: 100,
      animation: "fadeIn 0.2s ease",
    },
    endCard: {
      background: colors.panel,
      borderRadius: 20,
      padding: "36px 32px",
      textAlign: "center",
      maxWidth: 440,
      width: "90%",
      border: `2px solid ${colors.gold}44`,
    },
  };

  // --- TITLE SCREEN ---
  if (screen === "title") {
    return (
      <div style={styles.root}>
        <div style={styles.title}>
          <div style={styles.logo}>
            100 Metodólogos
            <br />
            Dijeron
          </div>
          <p style={styles.subtitle}>
            El juego de la Metodología de la Investigación. ¿Puedes adivinar
            las respuestas más populares? 10 rondas, 3 strikes por ronda.
          </p>
          <button
            style={styles.btn}
            onClick={startGame}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            ¡A jugar!
          </button>
        </div>
      </div>
    );
  }

  // --- END SCREEN ---
  if (screen === "end") {
    const g = getGrade();
    const max = ROUNDS.reduce(
      (s, r) => s + r.answers.reduce((a, b) => a + b.points, 0),
      0
    );
    return (
      <div style={styles.root}>
        <div style={styles.title}>
          <div style={{ fontSize: 64, marginBottom: 4 }}>{g.emoji}</div>
          <div style={{ ...styles.logo, fontSize: "clamp(1.4rem, 4vw, 2.2rem)" }}>
            Juego terminado
          </div>
          <div
            style={{
              fontSize: "clamp(2rem, 6vw, 3.2rem)",
              fontWeight: 900,
              color: colors.gold,
            }}
          >
            {finalScore} / {max}
          </div>
          <p style={{ ...styles.subtitle, fontSize: "1.05rem" }}>{g.msg}</p>
          <button
            style={styles.btn}
            onClick={startGame}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // --- ROUND SCREEN ---
  return (
    <div style={styles.root}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <span style={styles.badge}>
          Ronda {roundIdx + 1} / {ROUNDS.length}
        </span>
        <span style={{ ...styles.badge, ...styles.scoreBadge }}>
          ⭐ {totalScore + score} pts
        </span>
      </div>

      {/* Question */}
      <div style={styles.question}>{round.question}</div>

      {/* Answer board */}
      <div style={styles.board}>
        {round.answers.map((a, i) => {
          const isRevealed = revealed.includes(i) || revealAll;
          const isFlipping = flipIdx === i;
          return (
            <div key={i} style={styles.answerRow(isRevealed, isFlipping)}>
              <div style={styles.answerNum}>{i + 1}</div>
              {isRevealed ? (
                <>
                  <span style={styles.answerText}>{a.text}</span>
                  <span style={styles.answerPts}>{a.points}</span>
                </>
              ) : (
                <span style={styles.hiddenLabel}>• • • • •</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Strikes */}
      <div style={styles.strikesArea}>
        {[0, 1, 2].map((s) => (
          <div key={s} style={styles.strikeX(s < strikes)}>
            {s < strikes ? "✕" : ""}
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div style={styles.feedbackBar(feedback?.type)}>
        {feedback?.text || "\u00A0"}
      </div>

      {/* Input or Next button */}
      {!roundOver ? (
        <div style={styles.inputArea}>
          <input
            ref={inputRef}
            style={styles.input}
            placeholder="Escribe tu respuesta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGuess()}
            onFocus={(e) =>
              (e.target.style.borderColor = colors.blueBright)
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.12)")
            }
          />
          <button style={styles.sendBtn} onClick={handleGuess}>
            ¡Responder!
          </button>
        </div>
      ) : (
        <button
          style={{ ...styles.btn, marginTop: 4 }}
          onClick={nextRound}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {roundIdx + 1 >= ROUNDS.length ? "Ver resultado final" : "Siguiente ronda →"}
        </button>
      )}

      {/* Full-screen strike animation */}
      {showStrike && (
        <div style={styles.overlay}>
          <XMark />
        </div>
      )}
    </div>
  );
}
