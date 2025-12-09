import { useEffect, useState, useRef } from "react";
import StartBarWindows from "./StartBarWindows";
import useWindowManager from "./WindowManager";

import Logo from "./assets/images/icons/logo.png";

import "./StartBar.css";

const StartBar = () => {
  const { windows } = useWindowManager();
  const [time, setTime] = useState<string>("");
  const popupScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad minutes and seconds with leading zeros if less than 10
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    setTime(`${hours}:${formattedMinutes} ${ampm}`);
  };

  useEffect(() => {
    setInterval(updateClock, 1000);
  }, []);

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
        <button className={`c-start-bar__btn c-start-bar__btn--start`}>
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
          <div className="status-bar">
            <div className="status-bar-field">
              <span className="c-start-bar__time">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartBar;