const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const normalize = (v) =>
  String(v ?? "")
    .trim()
    .toUpperCase();

/* ---------------- Alphabet numbers ---------------- */
export function generateAlphaQuestions(count, difficulty) {
  const questions = [];
  const seen = new Set();
  let guard = 0;

  while (questions.length < count && guard++ < count * 60) {
    const reverse = difficulty === "easy" ? false : Math.random() < 0.5;
    const idx = randInt(0, 25);
    const kind = Math.random() < 0.5 ? "l2n" : "n2l";
    const key = `${kind}-${reverse}-${idx}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const letter = ALPHABET[idx];
    const value = reverse ? 26 - idx : idx + 1;
    const dirLabel = reverse
      ? "Reverse alphabet (Z = 1)"
      : "Forward alphabet (A = 1)";

    if (kind === "l2n") {
      questions.push({
        id: key,
        prompt: letter,
        helper: `${dirLabel} — what position?`,
        answer: String(value),
        inputMode: "numeric",
      });
    } else {
      questions.push({
        id: key,
        prompt: String(value),
        helper: `${dirLabel} — which letter?`,
        answer: letter,
        inputMode: "text",
      });
    }
  }
  return questions;
}

/* ---------------- Squares & cubes ---------------- */
const SQ_CFG = {
  easy: { squareMax: 15, cubeMax: 5, roots: false },
  medium: { squareMax: 25, cubeMax: 10, roots: false },
  hard: { squareMax: 30, cubeMax: 15, roots: true },
};

export function generateSquaresQuestions(count, difficulty) {
  const cfg = SQ_CFG[difficulty] ?? SQ_CFG.easy;
  const pool = [];

  for (let n = 2; n <= cfg.squareMax; n++) pool.push({ type: "square", n });
  for (let n = 2; n <= cfg.cubeMax; n++) pool.push({ type: "cube", n });
  if (cfg.roots) {
    for (let n = 2; n <= cfg.squareMax; n++)
      if (Math.random() < 0.3) pool.push({ type: "sqrt", n });
    for (let n = 2; n <= cfg.cubeMax; n++)
      if (Math.random() < 0.3) pool.push({ type: "cbrt", n });
  }

  shuffle(pool);
  const picked = [];
  let i = 0;
  while (picked.length < count) {
    if (i >= pool.length) {
      shuffle(pool);
      i = 0;
    }
    picked.push(pool[i++]);
  }

  return picked.map((p, index) => {
    const id = `${p.type}-${p.n}-${index}`;
    switch (p.type) {
      case "square":
        return {
          id,
          prompt: `${p.n}²`,
          helper: "Square",
          answer: String(p.n ** 2),
          inputMode: "numeric",
        };
      case "cube":
        return {
          id,
          prompt: `${p.n}³`,
          helper: "Cube",
          answer: String(p.n ** 3),
          inputMode: "numeric",
        };
      case "sqrt":
        return {
          id,
          prompt: `√${p.n ** 2}`,
          helper: "Square root",
          answer: String(p.n),
          inputMode: "numeric",
        };
      default:
        return {
          id,
          prompt: `∛${p.n ** 3}`,
          helper: "Cube root",
          answer: String(p.n),
          inputMode: "numeric",
        };
    }
  });
}

export const generators = {
  "alpha-number": generateAlphaQuestions,
  "squares-cubes": generateSquaresQuestions,
};
