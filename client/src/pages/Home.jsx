import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import GameCard from "@/components/common/GameCard";
import ThemeToggle from "@/components/common/ThemeToggle";
import { games } from "@/data/games";

export default function Home() {
  // Later: replace with real streak from localStorage
  const streak = 0;

  return (
    <div className="px-4 pt-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center">
          <img src="/text-logo.svg" alt="RankRush" className="h-7 w-auto" />
        </Link>

        <div className="flex items-center gap-1">
          <div
            title={`${streak}-day streak`}
            className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-orange-600 dark:text-orange-400"
          >
            <Flame className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold tabular-nums">{streak}</span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="mb-7 grid grid-cols-2 gap-2">
        {[
          { label: "Best", value: "—" },
          { label: "Played", value: "0" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-3 text-center"
          >
            <p className="text-lg font-bold tabular-nums">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Games
      </h2>
      <div className="space-y-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
