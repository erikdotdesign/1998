import type { WindowPopupType, WindowState } from './windowReducer';
import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./PopupWindow.css";

import BigfootImg from "./assets/images/ad/ad-bigfoot_img.webp";
import BigfootText from "./assets/images/ad/ad-bigfoot_overlay.webp";
import BugImg from "./assets/images/ad/ad-bug_img.webp";
import BugText from "./assets/images/ad/ad-bug_overlay.webp";
import HoroscopeImg from "./assets/images/ad/ad-horoscope_img.webp";
import HoroscopeText from "./assets/images/ad/ad-horoscope_overlay.webp";
import MoviesImg from "./assets/images/ad/ad-movies_img.webp";
import MoviesText from "./assets/images/ad/ad-movies_overlay.webp";
import ShopImg from "./assets/images/ad/ad-shop_img.webp";
import ShopText from "./assets/images/ad/ad-shop_overlay.webp";
import SpagettImg from "./assets/images/ad/ad-spagett_img.webp";
import SpagettText from "./assets/images/ad/ad-spagett_overlay.webp";

const popupWindowContent = (popupType: WindowPopupType) => {
  switch(popupType) {
    case "bigfoot":
      return {
        img: BigfootImg,
        text: BigfootText
      };
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
    case "shop":
      return {
        img: ShopImg,
        text: ShopText
      };
    case "spagett":
      return {
        img: SpagettImg,
        text: SpagettText
      };
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

  const content = popupWindowContent(win.popupType as WindowPopupType);

  return (
    <WindowContainer id={id} onClose={onClose}>
      <div className='c-popup-window'>
        <a className="c-popup-window__ad" onClick={onPopupClick}>
          <img src={content?.img} draggable="false" />
          <img src={content?.text} draggable="false" />
        </a>
      </div>
    </WindowContainer>
  );
};

export default PopupWindow;
