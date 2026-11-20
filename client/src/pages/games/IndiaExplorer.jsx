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

  function handleSubmit(event) {
    event.preventDefault();
    submitAnswer();
  }

  return (
    <main className="min-h-screen bg-[#101419] text-white p-4 md:p-8">
      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <p className="text-cyan-400 text-xs tracking-[0.25em] font-bold">
            GEOGRAPHY / INDIA
          </p>

          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            India Explorer
          </h1>

          <p className="text-slate-400 text-sm mt-1">
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* MAP SECTION */}
        <section className="bg-[#171D25] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 flex justify-between items-center border-b border-slate-800">
            <h2 className="font-semibold">Interactive India Map</h2>

            <span className="text-xs text-cyan-400">RANDOM CHALLENGE</span>
          </div>

          <div className="h-[480px] md:h-[650px] p-2">
            <IndiaMap
              data={data}
              selectedId={finished ? null : currentId}
              completedIds={completedIds}
            />
          </div>

          <div className="p-4 border-t border-slate-800 flex flex-wrap gap-5 text-xs text-slate-400">
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
        <aside className="bg-[#171D25] border border-slate-800 rounded-2xl p-5 h-fit">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">YOUR CHALLENGE</span>

            <span className="text-xs text-cyan-400">
              {finished ? "COMPLETED" : "IN PROGRESS"}
            </span>
          </div>

          {/* SCORE */}
          <div className="grid grid-cols-2 gap-3 mt-5">
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

          {/* PROGRESS */}
          <div className="mt-6">
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

          <div className="border-t border-slate-800 my-6" />

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
              <p className="text-xs text-slate-400 tracking-wider">
                QUESTION {currentIndex + 1} OF {total}
              </p>

              <h2 className="text-xl font-bold mt-3 leading-snug">
                Which state or Union Territory is highlighted?
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                Observe the cyan boundary on the map and identify it.
              </p>

              <form onSubmit={handleSubmit} className="mt-6">
                <label className="text-xs text-slate-400">
                  ENTER YOUR ANSWER
                </label>

                <input
                  type="text"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type location name..."
                  disabled={feedback?.type === "correct"}
                  autoComplete="off"
                  className="w-full mt-2 bg-[#101419] border border-slate-700 rounded-lg p-3 outline-none focus:border-cyan-400 transition-colors"
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

                <button
                  type="submit"
                  disabled={!answer.trim() || feedback?.type === "correct"}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg p-3 mt-4 transition-colors"
                >
                  Check Answer
                </button>
              </form>

              {feedback?.type === "correct" ? (
                <button
                  onClick={nextQuestion}
                  className="w-full border border-cyan-500 text-cyan-400 rounded-lg p-3 mt-3 hover:bg-cyan-500/10"
                >
                  Next Location →
                </button>
              ) : (
                <button
                  onClick={skipQuestion}
                  className="w-full border border-slate-700 text-slate-300 rounded-lg p-3 mt-3 hover:bg-slate-800"
                >
                  Skip Question →
                </button>
              )}
            </>
          )}
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
