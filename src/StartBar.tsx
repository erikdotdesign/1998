import { useState, useRef, useEffect } from "react";
import { PowerGlitchE } from "./PowerGlitchE";
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
  const popupBarRef = useRef<HTMLDivElement>(null);
  const popupScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const popups = Object.keys(windows).filter(id => windows[id].windowType === "popup");
  const nonPopups = Object.keys(windows).filter(id => windows[id].windowType !== "popup");
  
  useEffect(() => {
    if (!popupBarRef.current) return;
    PowerGlitchE.glitch(
      popupBarRef.current,
      {
        playMode: 'always',
        hideOverflow: false,
        timing: {
          duration: 2000,
        },
        glitchTimeSpan: {
          start: 0,
          end: 0.5,
        },
        shake: {
          velocity: 5,
          amplitudeX: 0.02,
          amplitudeY: 0.02,
        },
        slice: {
          count: 1,
          velocity: 15,
          minHeight: 0.02,
          maxHeight: 0.15,
        },
      }
    );
  }, []);

  return (
    <div className="c-start-bar">
      <div 
        className="c-start-bar__bar" ref={popupBarRef}
        style={{
          opacity: popups.length > 0 ? 1 : 0
        }}>
        <div className="c-start-bar__main" ref={popupScrollRef}>
          <StartBarWindows 
            scrollRef={popupScrollRef}
            ids={popups} />
        </div>
      </div>
      <div className="c-start-bar__bar">
        <StartMenuCursor
          startMenuOpen={startMenuOpen}
          setStartMenuOpen={setStartMenuOpen} />
        <StartMenu 
          startMenuOpen={startMenuOpen} />
        <button 
          className={`c-start-bar__btn c-start-bar__btn--start ${startMenuOpen ? "active" : ''}`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}>
          <img src={Logo} draggable="false" /> 
          Start
        </button>
        <div className="c-start-bar__divider" />
        <div className="c-start-bar__main" ref={mainScrollRef}>
          <StartBarWindows
            scrollRef={mainScrollRef}
            ids={nonPopups} />
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