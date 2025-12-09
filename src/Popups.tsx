import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { WindowPopupType, WindowState } from './windowReducer';
import useWindowManager from './WindowManager';
import PopupWindow from "./PopupWindow";

const Popups = ({ bounds }: { bounds: React.RefObject<HTMLElement | null> }) => {
  const { windows, dispatch } = useWindowManager();

  const didMount = useRef(false);

  const popupSequence: WindowPopupType[] = ["bigfoot", "bug", "horoscope", "movies", "shop", "spagett"];

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

  const openPopup = (index: number) => {
    if (index >= popupSequence.length) return;

    const id = uuidv4();

    const popupWidth = 275;
    const popupHeight = 400;

    const { x, y } = getRandomPosition(popupWidth, popupHeight);

    dispatch({
      type: "OPEN",
      id,
      x,
      y,
      width: popupWidth,
      height: popupHeight,
      bounds: bounds as React.RefObject<HTMLElement>,
      windowType: "popup",
      popupType: popupSequence[index]
    });

    setPopupIndex(index);
  };

  const reOpenPopup = (popupType: WindowPopupType) => {
    const id = uuidv4();

    const popupWidth = 275;
    const popupHeight = 400;

    const { x, y } = getRandomPosition(popupWidth, popupHeight);

    dispatch({
      type: "OPEN",
      id,
      x,
      y,
      width: popupWidth,
      height: popupHeight,
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