import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { games } from "@/data/games";
import { cn } from "@/lib/utils";

const COUNTS = [10, 20, 30];
const LEVELS = [
  { id: "easy", label: "Easy", hint: "Forward only, small range" },
  { id: "medium", label: "Medium", hint: "Mixed directions" },
  { id: "hard", label: "Hard", hint: "Mixed + reverse drills" },
];

export default function GameSetup() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = games.find((g) => g.id === gameId);

  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");

  if (!game) return null;

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold tracking-tight">{game.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{game.description}</p>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Questions
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {COUNTS.map((c) => (
            <button
              key={c}
              onClick={() => setCount(c)}
              className={cn(
                "rounded-xl border py-3 text-sm font-semibold transition",
                count === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Difficulty
        </h2>
        <div className="space-y-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setDifficulty(l.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                difficulty === l.id ? "border-primary bg-primary/5" : "bg-card",
              )}
            >
              <p className="font-semibold">{l.label}</p>
              <p className="text-sm text-muted-foreground">{l.hint}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-auto pb-8 pt-6">
        <Button
          className="h-12 w-full text-base"
          onClick={() =>
            navigate(
              `/play/${gameId}/quiz?count=${count}&difficulty=${difficulty}`,
            )
          }
        >
          Start
        </Button>
      </div>
    </div>
  );
}
