import { useCallback, useState } from "react";
import PlayButtonScreen from "./components/PlayButton/PlayButtonScreen";
import ArcReactorScreen from "./components/ArcReactor/ArcReactorScreen";
import MainPortfolioActivity from "./components/MainPortfolio/MainPortfolioActivity";

type Stage = "play" | "charging" | "portfolio";

/**
 * Orchestrates the full intro sequence:
 *   Stage 1 (Play Button) -> Stage 2 (Arc Reactor charge) -> Main Portfolio
 *
 * Each stage is a self-contained component; App only tracks *which* stage
 * is active and swaps them via simple state, letting each component own
 * its own animation lifecycle (mount/unmount = animation start/cleanup).
 */
export default function App() {
  const [stage, setStage] = useState<Stage>("play");

  const handlePlay = useCallback(() => setStage("charging"), []);
  const handleChargeComplete = useCallback(() => setStage("portfolio"), []);

  switch (stage) {
    case "play":
      return <PlayButtonScreen onPlay={handlePlay} />;
    case "charging":
      return (
        <ArcReactorScreen durationMs={3000} onChargeComplete={handleChargeComplete} />
      );
    case "portfolio":
      return <MainPortfolioActivity />;
  }
}
