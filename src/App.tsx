import { useRef, useState } from 'react';
import Boot from './Boot';
import StartBar from './StartBar';
import Desktop from './Desktop';
import Popups from './Popups';
import Wallpaper from './Wallpaper';
import './App.css';

const App = () => {
  const desktopRef = useRef(null);
  const [booted, setBooted] = useState<boolean>(false);

  return (
    booted
    ? <div className='c-app'>
        <Wallpaper />
        <Desktop ref={desktopRef}>
          <Popups
            bounds={desktopRef} />
        </Desktop>
        <StartBar />
      </div>
    : <Boot 
        setBooted={setBooted} />
  );
};

export default App;
