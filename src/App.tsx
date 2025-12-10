import { useEffect, useRef, useState } from 'react';
import { PowerGlitch } from 'powerglitch';
import useWindowManager from './WindowManager';
import Boot from './Boot';
import StartBar from './StartBar';
import Desktop from './Desktop';
import Popups from './Popups';
import Wallpaper from './Wallpaper';
import DesktopItems from './DesktopItems';
import BioWindow from './BioWindow';
import LinksWindow from './LinksWindow';
import Crash from './Crash';
import './App.css';

const App = () => {
  const { windows } = useWindowManager();
  const appRef = useRef(null);
  const desktopRef = useRef(null);
  const [booted, setBooted] = useState<boolean>(false);
  const [crashed, setCrashed] = useState<boolean>(false);
  const popups = Object.values(windows).filter(w => w.windowType === "popup");

  if (popups.length > 6 && !crashed) {
    setCrashed(true);
  }

  useEffect(() => {
    if (!appRef.current) return;
    PowerGlitch.glitch(
      appRef.current,
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
          end: popups.length * 0.3,
        },
        shake: {
          velocity: popups.length * 5,
          amplitudeX: (popups.length - 1) * 0.2,
          amplitudeY: (popups.length - 1) * 0.2,
        },
        slice: {
          count: 6,
          velocity: popups.length * 15,
          minHeight: popups.length * 0.02,
          maxHeight: popups.length * 0.15,
        },
      }
    );
  }, [popups.length]);

  return (
    <>
      <div 
        ref={appRef}
        className='c-app' 
        style={{opacity: booted ? 1 : 0}}>
        <Wallpaper />
        <Desktop ref={desktopRef}>
          <DesktopItems
            desktopRef={desktopRef} />
          {
            booted
            ? <Popups
                bounds={desktopRef} />
            : null
          }
          <BioWindow />
          <LinksWindow />
        </Desktop>
        <StartBar />
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
