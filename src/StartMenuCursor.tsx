import { useTransition, animated } from "@react-spring/web";
import cursorPng from "./assets/images/cursors/pointer.svg";

const StartMenuCursor = ({
  startMenuOpen,
  setStartMenuOpen,
}: {
  startMenuOpen: boolean;
  setStartMenuOpen: (startMenuOpen: boolean) => void;
}) => {

  const transitions = useTransition(
    startMenuOpen,
    {
      from: { transform: `translate(-100px, -500px)` },
      enter: { transform: `translate(40px, 12px)` },
      leave: { transform: `translate(-100px, 12px)` },
      delay: 125,
      config: { tension: 220, friction: 26 },
      onRest: () => {
        if (startMenuOpen) setStartMenuOpen(false);
      }
    }
  );

  return (
    transitions((style, item) =>
      item &&
      <animated.img
        src={cursorPng}
        draggable={false}
        style={{
          position: "fixed",
          width: 32,
          height: 32,
          zIndex: 9999,
          pointerEvents: "none",
          ...style
        }} />
    )
  );
}

export default StartMenuCursor;