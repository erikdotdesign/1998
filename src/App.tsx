import { useRef, useState } from 'react';
import Boot from './Boot';
import StartBar from './StartBar';
import Desktop from './Desktop';
import Popups from './Popups';
import Wallpaper from './Wallpaper';
import DesktopItems from './DesktopItems';
import BioWindow from './BioWindow';
import LinksWindow from './LinksWindow';
import './App.css';

const App = () => {
  const desktopRef = useRef(null);
  const [booted, setBooted] = useState<boolean>(false);

  return (
    <>
      <div className='c-app' style={{opacity: booted ? 1 : 0}}>
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
    </>
  );
};

export default App;
