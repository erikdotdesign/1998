import { useRef, useReducer } from "react";
import reducer from "./reducer";
import useDoom from "./useDoom";
import useSounds from "./useSounds";
import "./App.css";

import Canvas from "./Canvas";
import Controls from "./Controls";

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    error: null,
    loadProgress: null,
    menu: null
  });

  useSounds();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doomRef = useDoom(canvasRef, dispatch);

  return (
    <main 
      className="c-app">
      <Canvas 
        canvasRef={canvasRef}
        doomRef={doomRef}
        state={state}
        dispatch={dispatch} />
      <Controls 
        state={state}
        dispatch={dispatch} />
    </main>
  );
};

export default App;