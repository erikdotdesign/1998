import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import "./App.css";

const App = () => {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return (
    <div className="c-app">
      <div className="c-app__aspect">
        <div className="c-app__canvas">
          <PhaserGame ref={phaserRef} />
        </div>
      </div>
    </div>
  );
}

export default App;