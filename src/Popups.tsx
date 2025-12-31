import { useEffect, useState, useRef } from "react";
import { centerPosition } from "./helpers";
import { v4 as uuidv4 } from "uuid";
import type { WindowPopupType, WindowState } from './windowReducer';
import useWindowManager from './WindowManager';
import PopupWindow from "./PopupWindow";

const BASE_WIDTH = 300;
const BASE_HEIGHT = 475;
const ASPECT = BASE_WIDTH / BASE_HEIGHT;

const Popups = ({ 
  desktopRef 
}: { 
  desktopRef: React.RefObject<HTMLElement | null> 
}) => {
  const { windows, dispatch } = useWindowManager();

  const didMount = useRef(false);

  const popupSequence: WindowPopupType[] = ["music", "horoscope", "nessy", "scan", "shop", "movies"];

  const [popupIndex, setPopupIndex] = useState<number>(0);

  const getPopupSize = () => {
    if (!desktopRef.current) {
      return { width: BASE_WIDTH, height: BASE_HEIGHT };
    }

    const { width: bw, height: bh } =
      desktopRef.current.getBoundingClientRect();

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // max size we allow the popup to be
    const maxWidth = isMobile ? bw * 0.55 : BASE_WIDTH;
    const maxHeight = isMobile ? bh * 0.5 : BASE_HEIGHT;

    let width = maxWidth;
    let height = width / ASPECT;

    // If height overflows, clamp by height instead
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ASPECT;
    }

    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  };

  const getRandomPosition = (
    popupWidth: number,
    popupHeight: number
  ) => {
    const el = desktopRef.current;
    if (!el) return { x: 100, y: 100 };

    const { width: bw, height: bh } = el.getBoundingClientRect();

    const maxX = Math.max(0, bw - popupWidth);
    const maxY = Math.max(0, bh - popupHeight);

    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  const openPopup = (i: number) => {
    let index = i;
    if (index >= popupSequence.length) index = 0;

    const id = uuidv4();

    const { width, height } = getPopupSize();
    const { x, y } = getRandomPosition(width, height);

    dispatch({
      type: "OPEN",
      id,
      x,
      y,
      width,
      height,
      bounds: desktopRef as React.RefObject<HTMLElement>,
      windowType: "popup",
      popupType: popupSequence[index]
    });

    setPopupIndex(index);
  };

  const reOpenPopup = (popupType: WindowPopupType) => {
    const { width, height } = getPopupSize();
    const { x, y } = getRandomPosition(width, height);

    dispatch({
      type: "OPEN",
      id: uuidv4(),
      x,
      y,
      width,
      height,
      bounds: desktopRef as React.RefObject<HTMLElement>,
      windowType: "popup",
      popupType: popupType
    });

    // Error window
    const size = [350,150];
    const position = centerPosition(desktopRef, size[0], size[1]);

    dispatch({
      type: "OPEN",
      id: uuidv4(),
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
      bounds: desktopRef as React.RefObject<HTMLElement>,
      windowType: "error",
      popupType: null,
      body: `RED_DRAGON_${popupType.toUpperCase()}.EXE could not be closed.`
    });
  };

  // Automatically spawn first popup
  useEffect(() => {
    if (!didMount.current && desktopRef.current) {
      didMount.current = true;
      setTimeout(() => {
        openPopup(0);
      }, 1000);
    }
  }, []);

  return (
    <>
      {Object.values(windows).filter(w => w.windowType === "popup").map(p => (
        <PopupWindow
          key={p.id}
          id={p.id}
          onPopupClick={() => openPopup(popupIndex + 1)}
          onClose={(win: WindowState) => {
            reOpenPopup(win.popupType as WindowPopupType);
          }}
        />
      ))}
    </>
  );
};

export default Popups;