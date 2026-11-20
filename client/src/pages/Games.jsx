import { Link } from "react-router-dom";
import { Map, ArrowUpRight, Globe2, Lock } from "lucide-react";

const games = [
  {
    id: "india-explorer",
    title: "India Explorer",
    description:
      "Explore India's geography by identifying all 28 states and 8 Union Territories.",
    category: "GEOGRAPHY",
    difficulty: "Easy",
    icon: Map,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
    status: "Available",
    path: "/india-explorer",
  },
];

const Games = () => {
  return (
    <main className="min-h-screen bg-background px-4 py-6 pb-24">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary">
            LEARN THROUGH PLAY
          </p>

          <h1 className="text-3xl font-bold tracking-tight">Games</h1>

          <p className="text-sm text-muted-foreground max-w-lg">
            Challenge yourself, improve your knowledge and make learning more
            interesting.
          </p>
        </header>

        {/* Featured Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Games</h2>

            <span className="text-xs text-muted-foreground">
              {games.length} game available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => {
              const Icon = game.icon;

              return (
                <Link
                  key={game.id}
                  to={game.path}
                  className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${game.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${game.iconColor}`} />
                    </div>

                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {game.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                      {game.category}
                    </p>

                    <h3 className="text-xl font-bold">{game.title}</h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">
                      Difficulty: {game.difficulty}
                    </span>

                    <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                      Play Now
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Coming Soon</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-dashed p-5 opacity-70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Globe2 className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mt-5 font-semibold">World Explorer</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Identify countries, capitals and geographical locations around
                the world.
              </p>

              <span className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Games;
