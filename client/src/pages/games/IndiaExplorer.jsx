import { useEffect, useMemo, useRef, useState } from "react";

import IndiaMap from "@/components/games/india-game/IndiaMap";
import useIndiaQuiz from "@/hooks/useIndiaQuiz";

import indiaGeoJSON from "@/data/indian-states.json";

// GeoJSON files vary in which property holds the name — try the usual suspects.
function getFeatureName(feature) {
  const p = feature?.properties || {};
  const raw =
    p.name ??
    p.NAME ??
    p.Name ??
    p.ST_NM ??
    p.st_nm ??
    p.STATE ??
    p.state ??
    p.STATE_NAME ??
    p.state_name ??
    p.NAME_1 ??
    p.stname ??
    "";
  return String(raw).trim();
}

// Auto-advance delay after a correct answer.
// 650ms = quick enough to feel like a flow, slow enough to register the ✓.
const AUTO_ADVANCE_MS = 650;

function GameContent({ data }) {
  const quiz = useIndiaQuiz(data.features);

  const {
    currentId,
    currentIndex,
    total,
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
  } = quiz;

  const inputRef = useRef(null);
  const nextRef = useRef(null);

  // ── Suggestion dropdown state ─────────────────────────────
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const allNames = useMemo(() => {
    const names = data.features.map(getFeatureName).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [data.features]);

  const suggestions = useMemo(() => {
    const q = answer.trim().toLowerCase();
    if (!q) return allNames.slice(0, 10);
    return allNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 10);
  }, [answer, allNames]);

  function selectSuggestion(name) {
    setAnswer(name);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function toggleSuggestions() {
    setSuggestionsEnabled((v) => !v);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event) {
    if (!showSuggestions || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  }

  // Focus input on new question / wrong answer, "Next" after correct
  useEffect(() => {
    if (finished) return;

    if (feedback?.type === "correct") {
      nextRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [currentId, feedback, finished]);

  // Keep a stable ref to nextQuestion so the auto-advance timer doesn't reset
  // every render (in case the hook returns a fresh function each time).
  const nextQuestionRef = useRef(nextQuestion);
  useEffect(() => {
    nextQuestionRef.current = nextQuestion;
  }, [nextQuestion]);

  // Auto-advance to the next question after a correct answer.
  const feedbackType = feedback?.type;
  useEffect(() => {
    if (feedbackType !== "correct" || finished) return;

    const timer = setTimeout(() => {
      nextQuestionRef.current?.();
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [feedbackType, finished]);

  function handleSubmit(event) {
    event.preventDefault();
    submitAnswer();
  }

  const isCorrect = feedback?.type === "correct";

  return (
    <main className="min-h-screen bg-[#101419] text-white p-4 md:p-8">
      {/* Local keyframes for smooth transitions */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes questionFade {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-4 md:mb-6">
        <div>
          <p className="text-cyan-400 text-xs tracking-[0.25em] font-bold">
            GEOGRAPHY / INDIA
          </p>

          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            India Explorer
          </h1>

          <p className="text-slate-400 text-sm mt-1 hidden sm:block">
            Learn India's states and Union Territories.
          </p>
        </div>

        <button
          onClick={restartGame}
          className="border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-800 text-sm"
        >
          Restart
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:gap-6 items-start">
        {/* MAP SECTION — unchanged */}
        <section className="bg-[#171D25] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex justify-between items-center border-b border-slate-800">
            <h2 className="font-semibold">Interactive India Map</h2>
            <span className="text-xs text-cyan-400">RANDOM CHALLENGE</span>
          </div>

          <div className="h-[420px] lg:h-[calc(100vh-17rem)] lg:min-h-[480px] p-2">
            <IndiaMap
              data={data}
              selectedId={finished ? null : currentId}
              completedIds={completedIds}
            />
          </div>

          <div className="px-4 py-3 border-t border-slate-800 flex flex-wrap gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#202A35]" />
              Not attempted
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#123F55] border border-cyan-400" />
              Current question
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#164E45]" />
              Completed
            </span>
          </div>
        </section>

        {/* QUIZ PANEL */}
        <aside className="sticky bottom-0 lg:bottom-auto lg:top-4 z-20 bg-[#171D25] border border-slate-800 rounded-2xl p-4 lg:p-5 h-fit shadow-[0_-8px_24px_rgba(0,0,0,0.4)] lg:shadow-none">
          {finished ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold">Challenge Complete!</h2>
              <p className="text-slate-400 text-sm mt-2">
                You have finished the challenge.
              </p>
              <p className="text-cyan-400 text-2xl font-bold mt-5">
                {score} Points
              </p>
              <button
                onClick={restartGame}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg p-3 mt-6"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div
              key={currentId}
              style={{ animation: "questionFade 200ms ease-out" }}
            >
              {/* QUESTION HEADER — skip button now lives here */}
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 tracking-wider">
                  QUESTION {currentIndex + 1} OF {total}
                </p>

                <button
                  type="button"
                  onClick={skipQuestion}
                  disabled={isCorrect}
                  className="text-xs border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md hover:bg-slate-800 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Skip →
                </button>
              </div>

              <h2 className="text-lg lg:text-xl font-bold mt-2 leading-snug">
                Which state or Union Territory is highlighted?
              </h2>

              <p className="text-sm text-slate-400 mt-1 hidden lg:block">
                Observe the cyan boundary on the map and identify it.
              </p>

              <form onSubmit={handleSubmit} className="mt-4">
                {/* LABEL + SUGGESTIONS TOGGLE */}
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400">
                    ENTER YOUR ANSWER
                  </label>

                  <button
                    type="button"
                    onClick={toggleSuggestions}
                    aria-pressed={suggestionsEnabled}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span
                      className={`relative inline-block w-8 h-4 rounded-full transition-colors ${
                        suggestionsEnabled ? "bg-cyan-500" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                          suggestionsEnabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                    Suggestions {suggestionsEnabled ? "ON" : "OFF"}
                  </button>
                </div>

                {/* INPUT + SUGGESTIONS DROPDOWN */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(event) => {
                      setAnswer(event.target.value);
                      setHighlightedIndex(-1);
                      if (suggestionsEnabled) setShowSuggestions(true);
                    }}
                    onClick={() => {
                      if (suggestionsEnabled) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestions(false);
                        setHighlightedIndex(-1);
                      }, 150);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type location name..."
                    disabled={isCorrect}
                    autoComplete="off"
                    className="w-full bg-[#101419] border border-slate-700 rounded-lg p-3 text-base outline-none focus:border-cyan-400 transition-colors"
                  />

                  {suggestionsEnabled &&
                    showSuggestions &&
                    !isCorrect &&
                    suggestions.length > 0 && (
                      <ul
                        role="listbox"
                        className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-[#0B0F14] border border-slate-700 rounded-lg shadow-xl"
                      >
                        {suggestions.map((name, index) => (
                          <li
                            key={name}
                            role="option"
                            aria-selected={index === highlightedIndex}
                          >
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectSuggestion(name)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                index === highlightedIndex
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "text-slate-200 hover:bg-slate-800"
                              }`}
                            >
                              {name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* FEEDBACK — smooth fade-in */}
                {feedback && (
                  <div
                    className={`mt-3 text-sm p-3 rounded-lg ${
                      isCorrect
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                    style={{ animation: "fadeInUp 180ms ease-out" }}
                  >
                    {feedback.message}
                  </div>
                )}

                {/* SINGLE PRIMARY ACTION — submit or advance */}
                <div className="mt-3">
                  {isCorrect ? (
                    <button
                      ref={nextRef}
                      type="button"
                      onClick={nextQuestion}
                      className="w-full border border-cyan-500 text-cyan-400 rounded-lg p-3 hover:bg-cyan-500/10 focus:bg-cyan-500/10 outline-none"
                    >
                      Next Location →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg p-3 transition-colors"
                    >
                      Check Answer
                    </button>
                  )}
                </div>

                {isCorrect && (
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Auto-advancing…
                  </p>
                )}
              </form>

              <div className="border-t border-slate-800 my-4" />
            </div>
          )}

          {/* STATS — unchanged */}
          <div className="lg:hidden flex items-center justify-between text-xs text-slate-400">
            <span>
              Score <b className="text-white">{score}</b>
            </span>
            <span>
              Done{" "}
              <b className="text-white">
                {completedIds.size}/{total}
              </b>
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="hidden lg:block">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">YOUR CHALLENGE</span>
              <span className="text-xs text-cyan-400">
                {finished ? "COMPLETED" : "IN PROGRESS"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#202833] p-4 rounded-xl">
                <p className="text-xs text-slate-400">SCORE</p>
                <p className="text-2xl font-bold mt-1">{score}</p>
              </div>
              <div className="bg-[#202833] p-4 rounded-xl">
                <p className="text-xs text-slate-400">COMPLETED</p>
                <p className="text-2xl font-bold mt-1">
                  {completedIds.size}/{total}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Overall progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:hidden h-1.5 rounded-full bg-slate-700 overflow-hidden mt-2">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </aside>
      </div>

      <footer className="max-w-7xl mx-auto mt-8 text-center text-xs text-slate-500">
        INDIA EXPLORER · GEOGRAPHY PRACTICE
      </footer>
    </main>
  );
}

export default function IndiaExplorer() {
  const data = indiaGeoJSON;

  if (!data?.features || data.features.length !== 36) {
    return (
      <div className="min-h-screen bg-[#101419] text-red-400 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold">Map data loading failed</h2>
        <p className="mt-2 text-sm">
          Expected 36 locations, received {data?.features?.length ?? 0}.
        </p>
      </div>
    );
  }

  return <GameContent data={data} />;
}
