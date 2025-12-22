import { type LoadProgress } from "./reducer";
import { capitalize } from "./helpers";
import "./LoadingOverlay.css";

const LoadingOverlay = ({ 
  loading, 
  progress 
}: {
  loading: boolean;
  progress: LoadProgress | null;
}) => {
  if (!loading || !progress) return null;

  const isDone = progress.loaded === 100 && progress.stage === "game";

  return (
    <div className="c-loading-overlay">
      <div
        className={`c-loading-overlay__dg ${
          isDone ? "c-loading-overlay__dg--smile" : ""
        }`}
      />
      <div className="c-loading-overlay__header">
        {isDone ? "Loading Complete" : `Loading ${capitalize(progress.stage)}`}
      </div>
      <div className="c-loading-overlay__progress">
        {isDone ? "Starting Game" : `${progress.loaded}%`}
      </div>
    </div>
  );
};

export default LoadingOverlay;