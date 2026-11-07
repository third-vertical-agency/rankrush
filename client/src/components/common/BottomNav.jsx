import { NavLink } from "react-router-dom";
import { Home, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="flex h-16 items-stretch">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
