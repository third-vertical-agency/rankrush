import GameCard from "@/components/common/GameCard";
import { games } from "@/data/games";

export default function Home() {
  return (
    <div className="px-4 pt-8">
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">Ready when you are</p>
        <h1 className="text-2xl font-bold tracking-tight">RankRush</h1>
      </header>

      <div className="mb-7 grid grid-cols-3 gap-2">
        {[
          { label: "Streak", value: "0" },
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
