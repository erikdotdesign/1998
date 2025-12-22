import { type Action, type State } from "./reducer";
import { type DoomRef } from "./useDoom";
import "./Canvas.css";

import MenuRouter from "./MenuRouter";
import ErrorOverlay from "./ErrorOverlay";
import LoadingOverlay from "./LoadingOverlay";

const Canvas = ({
  canvasRef,
  doomRef,
  state, 
  dispatch
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  doomRef: DoomRef;
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    <div className="c-canvas">
      <ErrorOverlay error={state.error} />
      <LoadingOverlay 
        loading={state.status === "loading"}
        progress={state.loadProgress} />
      <MenuRouter
        doomRef={doomRef}
        state={state}
        dispatch={dispatch} />
      <div className="c-canvas__border" />
      <div className="c-canvas__aspect">
        <canvas 
          ref={canvasRef}
          className="c-canvas__canvas"
          tabIndex={0}
          onClick={() => {
            canvasRef.current?.focus();
            if (state.menu) dispatch({type: "CLOSE_MENU"});
          }} />
      </div>
    </div>
  );
};

export default Canvas;