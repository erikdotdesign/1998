import { useRef, useState } from 'react';
import Boot from './Boot';
import Window from "./Window";
import StartBar from './StartBar';
import Desktop from './Desktop';
import useWindowManager from './WindowManager';
import './App.css';

const App = () => {
  const { windows, dispatch } = useWindowManager();
  const desktopRef = useRef(null);
  const [booted, setBooted] = useState<boolean>(false);

  const spawnAd = () => {
    dispatch({
      type: "OPEN",
      id: `${Date.now()}`,
      windowType: "popup",
      popupType: "bug"
    });
  };

  return (
    booted
    ? <div className='c-app'>
        <Desktop ref={desktopRef}>
          <button className="spawn-btn" onClick={spawnAd}>
            Spawn Ad Popup
          </button>

          {windows.map(window => (
            <Window
              key={window.id}
              id={window.id}
              bounds={desktopRef}
              z={window.z}
              title={window.title}
              inactive={!window.focused}
              onClose={() => dispatch({ type: "CLOSE", id: window.id })}
              onMouseDown={() => dispatch({ type: "FOCUS", id: window.id })}
              icon={window.icon}>
              <p>You've won a free iPod Nano!</p>
            </Window>
          ))}
        </Desktop>
        <StartBar />
      </div>
    : <Boot 
        setBooted={setBooted} />
  );
};

export default App;
