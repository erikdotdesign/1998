import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { WindowPopupType, WindowState } from './windowReducer';
import useWindowManager from './WindowManager';
import PopupWindow from "./PopupWindow";

const POPUP_WIDTH = 300;
const POPUP_HEIGHT = 475;

const Popups = ({ bounds }: { bounds: React.RefObject<HTMLElement | null> }) => {
  const { windows, dispatch } = useWindowManager();

  const didMount = useRef(false);

  const popupSequence: WindowPopupType[] = ["bug", "shop", "horoscope", "movies", "spagett", "bigfoot"];

  const [popupIndex, setPopupIndex] = useState<number>(0);

  const getRandomPosition = (
    popupWidth: number,
    popupHeight: number
  ) => {
    const el = bounds.current;
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

    const { x, y } = getRandomPosition(POPUP_WIDTH, POPUP_HEIGHT);

    dispatch({
      type: "OPEN",
      id,
      x,
      y,
      width: POPUP_WIDTH,
      height: POPUP_HEIGHT,
      bounds: bounds as React.RefObject<HTMLElement>,
      windowType: "popup",
      popupType: popupSequence[index]
    });

    setPopupIndex(index);
  };

  const reOpenPopup = (popupType: WindowPopupType) => {
    const id = uuidv4();

    const { x, y } = getRandomPosition(POPUP_WIDTH, POPUP_HEIGHT);

    dispatch({
      type: "OPEN",
      id,
      x,
      y,
      width: POPUP_WIDTH,
      height: POPUP_HEIGHT,
      bounds: bounds as React.RefObject<HTMLElement>,
      windowType: "popup",
      popupType: popupType
    });
  };

  // Automatically spawn first popup
  useEffect(() => {
    if (!didMount.current && bounds.current) {
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