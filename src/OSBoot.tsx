import { useEffect, useState } from "react";
import infoIcon from "./assets/images/icons/info.png";
import bootLogo from "./assets/images/boot/boot-logo.webp";

import "./OSBoot.css";

const OSBoot = ({
  setBooted,
  duration = 3000
}: {
  setBooted: (booted: boolean) => void;
  duration?: number;
}) => {
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const start = performance.now();

    const tick = () => {
      const now = performance.now();
      const progress = Math.min(((now - start) / duration) * 100, 100);
      setLoaded(progress);

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setBooted(true);
      }
    };

    requestAnimationFrame(tick);
  }, [duration, setBooted]);

  return (
    <div className="c-os-boot">
      <div className="c-os-boot__logo">
        <img src={bootLogo} draggable="false" />
      </div>
      <div className="c-os-boot__progress">
        <div className="c-os-boot__loading-bar">
          <div className="progress-indicator segmented">
            <span className="progress-indicator-bar" style={{ width: `${loaded}%` }} />
          </div>
        </div>
        <div className="c-os-boot__info">
          <img src={infoIcon} draggable="false" />
          <span>Everything is already loaded, this is just for effect.</span>
        </div>
      </div>
    </div>
  );
};

export default OSBoot;