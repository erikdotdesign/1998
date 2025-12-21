import { useEffect, useRef, useState } from 'react';
import { PowerGlitchE } from "./PowerGlitchE";
import useWindowManager from './WindowManager';
import Boot from './Boot';
import StartBar from './StartBar';
import Desktop from './Desktop';
import Wallpaper from './Wallpaper';
import Crash from './Crash';
import './App.css';

const App = () => {
  const { windows } = useWindowManager();
  const glitchRef = useRef(null);
  const [booted, setBooted] = useState<boolean>(false);
  const [crashed, setCrashed] = useState<boolean>(false);
  const popups = Object.values(windows).filter(w => w.windowType === "popup");
  const ids = popups.map(p => p.id);
  const idsKey = ids.join(",");

  if (popups.length > 6 && !crashed) {
    setCrashed(true);
  }

  useEffect(() => {
    if (!glitchRef.current) return;
    PowerGlitchE.glitch(
      glitchRef.current,
      {
        playMode: 'always',
        hideOverflow: true,
        timing: {
          duration: 1000,
          iterations: 1,
          easing: 'ease-in-out',
        },
        glitchTimeSpan: {
          start: 0,
          end: popups.length * 0.15,
        },
        shake: {
          velocity: popups.length * 5,
          amplitudeX: (popups.length - 1) * 0.01,
          amplitudeY: (popups.length - 1) * 0.01,
        },
        slice: {
          count: 1,
          velocity: popups.length * 15,
          minHeight: popups.length * 0.02,
          maxHeight: popups.length * 0.15,
        },
      }
    );
  }, [popups.length, idsKey]);

  return (
    <>
      <div 
        className='c-app' 
        style={{opacity: booted ? 1 : 0}}>
        <Wallpaper 
          popupKey={idsKey}
          popupsLength={popups.length} />
        <div 
          className='c-app__desktop'
          ref={glitchRef}>
          {
            booted
            ? <>
                <Desktop />
                <StartBar />
              </>
            : null
          }
        </div>
      </div>
      {
        !booted
        ? <Boot setBooted={setBooted} />
        : null
      }
      {
        crashed
        ? <Crash
            setBooted={setBooted}
            setCrashed={setCrashed} />
        : null
      }
    </>
  );
};

export default App;
