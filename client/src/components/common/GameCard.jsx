import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function GameCard({ game }) {
  return (
    <Link
      to={`/play/${game.id}`}
      className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition active:scale-[0.98]"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-xl`}
      >
        {game.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{game.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {game.description}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
