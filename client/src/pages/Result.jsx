import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Result() {
  const { gameId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const score = Number(params.get("score")) || 0;
  const total = Number(params.get("total")) || 0;
  const time = Number(params.get("time")) || 0;
  const accuracy = total ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Round complete
      </p>

      <div className="my-4 text-7xl font-bold tabular-nums">
        {score}
        <span className="text-3xl text-muted-foreground">/{total}</span>
      </div>

      <div className="mb-10 flex gap-6 text-sm text-muted-foreground">
        <span>
          Accuracy{" "}
          <span className="font-semibold text-foreground">{accuracy}%</span>
        </span>
        <span>
          Time <span className="font-semibold text-foreground">{time}s</span>
        </span>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button
          className="h-12 w-full text-base"
          onClick={() => navigate(`/play/${gameId}`, { replace: true })}
        >
          Play again
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full text-base"
          onClick={() => navigate("/", { replace: true })}
        >
          Back home
        </Button>
      </div>
    </div>
  );
}
