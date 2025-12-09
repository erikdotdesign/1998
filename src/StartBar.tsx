import { useState, useRef } from "react";
import StartBarWindows from "./StartBarWindows";
import useWindowManager from "./WindowManager";
import StartMenu from "./StartMenu";
import StartMenuCursor from "./StartMenuCursor";
import StartBarClock from "./StartBarClock";

import Logo from "./assets/images/icons/logo.png";

import "./StartBar.css";

const StartBar = () => {
  const { windows } = useWindowManager();
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const popupScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="c-start-bar">
      <div className="c-start-bar__bar">
        <div className="c-start-bar__main" ref={popupScrollRef}>
          <StartBarWindows 
            scrollRef={popupScrollRef}
            ids={Object.keys(windows).filter(id => windows[id].windowType === "popup")} />
        </div>
      </div>
      <div className="c-start-bar__bar">
        <StartMenuCursor
          startMenuOpen={startMenuOpen}
          setStartMenuOpen={setStartMenuOpen} />
        <StartMenu 
          startMenuOpen={startMenuOpen}
          setStartMenuOpen={setStartMenuOpen} />
        <button 
          className={`c-start-bar__btn c-start-bar__btn--start ${startMenuOpen ? "active" : ''}`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}>
          <img src={Logo} draggable="false" /> 
          S t a r t
        </button>
        <div className="c-start-bar__divider" />
        <div className="c-start-bar__main" ref={mainScrollRef}>
          <StartBarWindows
            scrollRef={mainScrollRef}
            ids={Object.keys(windows).filter(id => windows[id].windowType !== "popup")} />
        </div>
        <div className="c-start-bar__divider" />
        <div className="c-start-bar__status">
          <StartBarClock />
        </div>
      </div>
    </div>
  );
};

export default StartBar;