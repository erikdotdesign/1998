import { useState } from "react";
import IFrameWindow from "./IframeWindow";
import InfoIcon from "./assets/images/icons/info.png";

import "./DoomWindow.css";

const DoomWindow = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <IFrameWindow
      windowType="doom"
      iframeSrc="./doom/index.html"
      className="c-doom-window">
      {showModal && (
        <div className="c-doom-window__modal">
          <img src={InfoIcon} />
          <div>
            <h5>Keyboard Required</h5>
            <p><i>This game also has sound</i></p>
          </div>
          <button 
            onClick={() => setShowModal(false)}
            data-analytics={`doom-modal`}>
            Ok
          </button>
        </div>
      )}
    </IFrameWindow>
  );
};

export default DoomWindow;
