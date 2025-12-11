import { useTransition, animated } from "@react-spring/web";
import cursorPng from "./assets/images/cursors/red-dragon-pointer.png";

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
      // delay: 125,
      config: { duration: 1200 },
      onRest: () => {
        if (startMenuOpen) {
          setTimeout(() => {
            setStartMenuOpen(false);
          }, 500);
        }
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