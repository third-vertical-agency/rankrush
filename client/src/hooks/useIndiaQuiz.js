import { useState, useEffect } from "react";

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

const aliases = {
  andamanandnicobarislands: ["andamanandnicobar", "andamanandnicobarisland"],
  dadranagarhavelianddamananddiu: ["dadranagarhaveli", "damananddiu"],
  delhi: ["nctofdelhi", "nationalcapitalterritoryofdelhi"],
};

function isCorrectAnswer(input, feature) {
  const expected = normalize(feature.properties.name);
  const submitted = normalize(input);

  const accepted = [expected, ...(aliases[expected] || [])];

  return accepted.some((name) => normalize(name) === submitted);
}

export default function useIndiaQuiz(features) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);

  const [completedIds, setCompletedIds] = useState(() => new Set());

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (features?.length) {
      setQuestions(shuffle(features));
    }
  }, [features]);

  const currentFeature = questions[currentIndex];

  const currentId = currentFeature
    ? currentFeature.properties.iso ||
      currentFeature.properties.id ||
      currentFeature.properties.name
    : null;

  const finished = questions.length > 0 && currentIndex >= questions.length;

  const nextQuestion = () => {
    setCurrentIndex((index) => index + 1);
    setAnswer("");
    setFeedback(null);
  };

  const submitAnswer = () => {
    if (!currentFeature || !answer.trim() || feedback?.type === "correct") {
      return;
    }

    if (isCorrectAnswer(answer, currentFeature)) {
      setCompletedIds((previous) => {
        const next = new Set(previous);
        next.add(currentId);
        return next;
      });

      setScore((previous) => previous + 10);

      setFeedback({
        type: "correct",
        message: "Correct! Well done.",
      });
    } else {
      setFeedback({
        type: "wrong",
        message: "Incorrect. Try again!",
      });
    }
  };

  const skipQuestion = () => {
    if (finished) return;
    nextQuestion();
  };

  const restartGame = () => {
    setQuestions(shuffle(features));
    setCurrentIndex(0);
    setScore(0);
    setCompletedIds(new Set());
    setAnswer("");
    setFeedback(null);
  };

  const progress = questions.length
    ? (completedIds.size / questions.length) * 100
    : 0;

  return {
    currentFeature,
    currentId,
    currentIndex,
    total: questions.length,
    answer,
    setAnswer,
    score,
    completedIds,
    feedback,
    finished,
    progress,
    submitAnswer,
    nextQuestion,
    skipQuestion,
    restartGame,
  };
}
