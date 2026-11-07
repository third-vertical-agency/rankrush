import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeProvider";

import MainLayout from "./components/common/MainLayout";
import Home from "./pages/Home";
import GameSetup from "@/pages/GameSetup";
import Quiz from "@/pages/Quiz";
import Result from "@/pages/Result";
import Stats from "@/pages/Stats";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="play/:gameId" element={<GameSetup />} />
            <Route path="play/:gameId/quiz" element={<Quiz />} />
            <Route path="play/:gameId/result" element={<Result />} />
            <Route path="stats" element={<Stats />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
