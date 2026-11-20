import { useEffect, useRef } from "react";

import IndiaMap from "@/components/games/india-game/IndiaMap";
import useIndiaQuiz from "@/hooks/useIndiaQuiz";

import indiaGeoJSON from "@/data/indian-states.json";

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

  // Focus the input on every new question / wrong answer,
  // and focus "Next" after a correct answer so Enter moves on.
  useEffect(() => {
    if (finished) return;

    if (feedback?.type === "correct") {
      nextRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [currentId, feedback, finished]);

  function handleSubmit(event) {
    event.preventDefault();
    submitAnswer();
  }

  return (
    <main className="min-h-screen bg-[#101419] text-white p-4 md:p-8">
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
        {/* MAP SECTION */}
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

        {/* QUIZ PANEL
            Mobile: sticks to the bottom of the screen so the answer box is always reachable.
            Desktop: sticks beside the map. */}
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
            <>
              {/* QUESTION — now at the very top */}
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400 tracking-wider">
                  QUESTION {currentIndex + 1} OF {total}
                </p>

                <span className="text-xs text-cyan-400">IN PROGRESS</span>
              </div>

              <h2 className="text-lg lg:text-xl font-bold mt-2 leading-snug">
                Which state or Union Territory is highlighted?
              </h2>

              <p className="text-sm text-slate-400 mt-1 hidden lg:block">
                Observe the cyan boundary on the map and identify it.
              </p>

              <form onSubmit={handleSubmit} className="mt-4">
                <label className="text-xs text-slate-400 hidden lg:block">
                  ENTER YOUR ANSWER
                </label>

                <input
                  ref={inputRef}
                  type="text"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type location name..."
                  disabled={feedback?.type === "correct"}
                  autoComplete="off"
                  className="w-full lg:mt-2 bg-[#101419] border border-slate-700 rounded-lg p-3 text-base outline-none focus:border-cyan-400 transition-colors"
                />

                {feedback && (
                  <div
                    className={`mt-3 text-sm p-3 rounded-lg ${
                      feedback.type === "correct"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 mt-3">
                  <button
                    type="submit"
                    disabled={!answer.trim() || feedback?.type === "correct"}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg p-3 transition-colors"
                  >
                    Check Answer
                  </button>

                  {feedback?.type === "correct" ? (
                    <button
                      ref={nextRef}
                      type="button"
                      onClick={nextQuestion}
                      className="border border-cyan-500 text-cyan-400 rounded-lg p-3 hover:bg-cyan-500/10 focus:bg-cyan-500/10 outline-none"
                    >
                      Next Location →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={skipQuestion}
                      className="border border-slate-700 text-slate-300 rounded-lg p-3 hover:bg-slate-800"
                    >
                      Skip Question →
                    </button>
                  )}
                </div>
              </form>

              <div className="border-t border-slate-800 my-4" />
            </>
          )}

          {/* STATS — moved below the answer area */}
          {/* Compact one-line version (mobile) */}
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

          {/* Full cards (desktop) */}
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

          {/* Thin progress bar (mobile) */}
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
