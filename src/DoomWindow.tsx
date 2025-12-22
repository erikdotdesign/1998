import WindowContainer from "./WindowContainer";
import LoadingModal from "./LoadingModal";
import useWindowManager from './WindowManager';
import InfoIcon from "./assets/images/icons/info.png";

import "./DoomWindow.css";
import { useState } from "react";

const DoomWindow = () => {
  const [loading, setLoading] = useState(true);
  const { windows, dispatch } = useWindowManager();
  const [showModal, setShowModal] = useState(true);
  
  const win = Object.values(windows).find(w => w.windowType === "doom");
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
      <div className="c-doom-window field-border">
        {loading && (
          <LoadingModal />
        )}
        <iframe
          data-glitch-ignore
          className="c-doom-window__iframe"
          src="./doom/index.html"
          allow="autoplay; fullscreen"
          onLoad={() => setLoading(false)} />
        {showModal && (
          <div className="c-doom-window__modal">
            <img src={InfoIcon} />
            <div>
              <h5>Keyboard Required</h5>
              <p><i>This game also has sound</i></p>
            </div>
            <button onClick={() => setShowModal(false)}>Ok</button>
          </div>
        )}
      </div>
    </WindowContainer>
  );
};

export default DoomWindow;
