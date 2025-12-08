import { useEffect, useState } from "react";

import Logo from "./assets/images/icons/logo.png";

import "./StartBar.css";
import useWindowManager from "./WindowManager";

const StartBar = () => {
  const { windows, dispatch } = useWindowManager();
  const [time, setTime] = useState<string>("");

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
      <button 
        className={`c-start-bar__btn c-start-bar__btn--start`}>
        <img src={Logo} /> 
        Start
      </button>
      <div className="c-start-bar__divider" />
      <div className="c-start-bar__windows">
        {
          Object.values(windows).map((win) => (
            <button 
              key={win.id}
              className={`c-start-bar__btn c-start-bar__btn--window ${win.focused ? "active" : ''}`} 
              onClick={() => {
                if (win.minimized) {
                  dispatch({
                    type: "RESTORE",
                    id: win.id
                  });
                } else {
                  dispatch({
                    type: "FOCUS",
                    id: win.id
                  });
                }
              }}>
              { win.icon ? <img src={win.icon} /> : null }
              <span>{ win.title }</span>
            </button>
          ))
        }
      </div>
      <div className="c-start-bar__divider" />
      <div className="c-start-bar__status">
        <div className="status-bar">
          <div className="status-bar-field">{time}</div>
        </div>
      </div>
    </div>
  );
};

export default StartBar;