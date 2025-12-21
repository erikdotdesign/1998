import { useEffect, useRef } from 'react';
import { PowerGlitchE } from "./PowerGlitchE";
import type { WindowPopupType, WindowState } from './windowReducer';
import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./PopupWindow.css";

// import BigfootImg from "./assets/images/ad/ad-bigfoot_img.webp";
// import BigfootText from "./assets/images/ad/ad-bigfoot_overlay.webp";
import BugImg from "./assets/images/ad/ad-bug_img.webp";
import BugText from "./assets/images/ad/ad-bug_overlay.webp";
import HoroscopeImg from "./assets/images/ad/ad-horoscope_img.webp";
import HoroscopeText from "./assets/images/ad/ad-horoscope_overlay.webp";
import MoviesImg from "./assets/images/ad/ad-movies_img.webp";
import MoviesText from "./assets/images/ad/ad-movies_overlay.webp";
import ShopImg from "./assets/images/ad/ad-shop_img.webp";
import ShopText from "./assets/images/ad/ad-shop_overlay.webp";
// import SpagettImg from "./assets/images/ad/ad-spagett_img.webp";
// import SpagettText from "./assets/images/ad/ad-spagett_overlay.webp";
import MusicImg from "./assets/images/ad/ad-music_img.webp";
import MusicText from "./assets/images/ad/ad-music_overlay.webp";
import NessyImg from "./assets/images/ad/ad-nessy_img.webp";
import NessyText from "./assets/images/ad/ad-nessy_overlay.webp";

const popupWindowContent = (popupType: WindowPopupType) => {
  switch(popupType) {
    // case "bigfoot":
    //   return {
    //     img: BigfootImg,
    //     text: BigfootText
    //   };
    case "bug":
      return {
        img: BugImg,
        text: BugText
      };
    case "horoscope":
      return {
        img: HoroscopeImg,
        text: HoroscopeText
      };
    case "movies":
      return {
        img: MoviesImg,
        text: MoviesText
      };
    case "music":
      return {
        img: MusicImg,
        text: MusicText
      };
    case "nessy":
      return {
        img: NessyImg,
        text: NessyText
      };
    case "shop":
      return {
        img: ShopImg,
        text: ShopText
      };
    // case "spagett":
    //   return {
    //     img: SpagettImg,
    //     text: SpagettText
    //   };
  }
};

const PopupWindow = ({
  id,
  onPopupClick,
  onClose
}: {
  id: string;
  onPopupClick?: () => void;
  onClose?: (window: WindowState) => void;
}) => {
  const { windows } = useWindowManager();
  const win = windows[id];
  const imgRef = useRef(null);

  const content = popupWindowContent(win.popupType as WindowPopupType);

  useEffect(() => {
    if (!imgRef.current) return;
    PowerGlitchE.glitch(
      imgRef.current,
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
    <WindowContainer 
      id={id} 
      onClose={onClose}>
      <div className='c-popup-window'>
        <div className="c-popup-window__ad-wrap" ref={imgRef}>
          <a className="c-popup-window__ad" onClick={onPopupClick}>
            <img src={content?.img} draggable="false" />
            <img src={content?.text} draggable="false" />
          </a>
        </div>
      </div>
    </WindowContainer>
  );
};

export default PopupWindow;
