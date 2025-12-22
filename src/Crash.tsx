import { useState, useEffect } from 'react';
import useWindowManager from './WindowManager';
import './Crash.css';

const Crash = ({
  duration = 7000,
  setCrashed,
  setBooted
}: {
  duration?: number;
  setCrashed: (crashed: boolean) => void;
  setBooted: (booted: boolean) => void;
}) => {
  const [loaded, setLoaded] = useState(0);
  const { windows, dispatch } = useWindowManager();
  const secondsLeft = Math.ceil(((100 - loaded) / 100) * (duration / 1000));

  useEffect(() => {
    if (Object.values(windows).length > 0) {
      dispatch({
        type: "CLOSE_ALL"
      });
    }
  }, []);
  
  useEffect(() => {
    const start = performance.now();

    const tick = () => {
      const now = performance.now();
      const progress = Math.min(((now - start) / duration) * 100, 100);
      setLoaded(progress);

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setCrashed(false);
        setBooted(false);
      }
    };

    requestAnimationFrame(tick);
  }, [duration, setBooted, setCrashed, dispatch]);

  return (
    <div className='c-crash'>
      <pre>
        {`A problem has been detected and Portfolio 98 has been shut down to prevent damage to your device.\n\nThe problem seems to be caused by the following file: RED_DRAGON.EXE\n\nRestarting in ${secondsLeft}s`}
      </pre>
    </div>
  );
};

export default Crash;
