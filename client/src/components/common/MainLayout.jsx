import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "@/components/common/BottomNav";

export default function MainLayout() {
  const { pathname } = useLocation();
  const hideNav = pathname.endsWith("/quiz");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <main className={hideNav ? "flex-1" : "flex-1 pb-24"}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
