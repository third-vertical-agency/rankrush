import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { generators, normalize } from "@/lib/generators";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const { gameId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const count = Number(params.get("count")) || 10;
  const difficulty = params.get("difficulty") || "easy";
  const generate = generators[gameId];

  const questions = useMemo(
    () => (generate ? generate(count, difficulty) : []),
    [generate, count, difficulty],
  );

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | correct | wrong
  const [score, setScore] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startedAt = useRef(Date.now());

  const q = questions[index];

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!generate) {
    navigate("/", { replace: true });
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (status !== "idle" || !q || !input.trim()) return;

    const ok = normalize(input) === normalize(q.answer);
    const newScore = score + (ok ? 1 : 0);

    setScore(newScore);
    setStatus(ok ? "correct" : "wrong");

    timerRef.current = setTimeout(
      () => {
        setStatus("idle");
        setInput("");

        if (index + 1 >= questions.length) {
          const time = Math.round((Date.now() - startedAt.current) / 1000);
          navigate(
            `/play/${gameId}/result?score=${newScore}&total=${questions.length}&time=${time}`,
            { replace: true },
          );
        } else {
          setIndex((i) => i + 1);
        }
      },
      ok ? 450 : 1200,
    );
  }

  return (
    <div className="flex min-h-dvh flex-col px-4">
      <header className="flex items-center gap-3 py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-5 w-5" />
        </Button>
        <Progress
          value={(index / questions.length) * 100}
          className="h-2 flex-1"
        />
        <span className="w-12 text-right text-sm font-medium tabular-nums text-muted-foreground">
          {index + 1}/{questions.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-16">
        <p className="text-sm font-medium text-muted-foreground">{q?.helper}</p>

        <div className="text-6xl font-bold tracking-tight tabular-nums">
          {q?.prompt}
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode={q?.inputMode}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            disabled={status !== "idle"}
            placeholder={q?.inputMode === "numeric" ? "Number" : "Letter"}
            className={cn(
              "h-14 text-center text-2xl font-semibold",
              status === "correct" && "border-emerald-500 text-emerald-600",
              status === "wrong" && "border-red-500 text-red-600",
            )}
          />

          {status === "wrong" && (
            <p className="text-center text-sm text-muted-foreground">
              Correct answer:{" "}
              <span className="font-semibold text-foreground">{q.answer}</span>
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full text-base"
            disabled={!input.trim() || status !== "idle"}
          >
            Check
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          Score <span className="font-semibold text-foreground">{score}</span>
        </p>
      </div>
    </div>
  );
}
