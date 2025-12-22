import { useState } from "react";
import LoadingModal from "./LoadingModal";
import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./PokemonWindow.css";

const PokemonWindow = () => {
  const { windows, dispatch } = useWindowManager();
  const [loading, setLoading] = useState(true);
  
  const win = Object.values(windows).find(w => w.windowType === "pokemon");
  const min = win && win.minimized

  if (!win) {
    if (!loading) setLoading(true);
    return;
  };

  if (min) {
    if (!loading) setLoading(true);
  }

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-pokemon-window field-border">
        {loading && (
          <LoadingModal />
        )}
        <iframe
          data-glitch-ignore
          className="c-pokemon-window__iframe"
          src="./pokemon-sv-151/index.html"
          allow="autoplay; fullscreen"
          onLoad={() => setLoading(false)} />
      </div>
    </WindowContainer>
  );
};

export default PokemonWindow;
