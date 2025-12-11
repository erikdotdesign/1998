import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { centerPosition } from './helpers';
import useWindowManager from './WindowManager';
import CommandWindow from './CommandWindow';

const COMMANDS = [
  "Hi! Don't listen to him, click the popups ;)",
  "His portfolio is boring, click the popups.",
  "Don't ignore me! Just click the popups!",
  "Whatever, you won't hire him anyway..."
];

const RedDragon = ({
  desktopRef
}: {
  desktopRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { windows, dispatch } = useWindowManager();
  const [bioOpened, setBioOpened] = useState(false);
  const [ticks, setTicks] = useState(0);
  const cmdWin = Object.values(windows).find(
    w => w.windowType === "command-prompt"
  );
  const cmdWinId = cmdWin ? cmdWin.id : null;

  if (Object.values(windows).find(w => w.windowType === "bio") && !bioOpened) {
    setBioOpened(true);
  } 

  useEffect(() => {
    if (!desktopRef.current || !bioOpened) return;
    const interval = setInterval(() => {
      if (ticks < COMMANDS.length) {
        if (!cmdWinId) {
          const size = [548, 400];
          const position = centerPosition(desktopRef, size[0], size[1]);
          dispatch({
            type: "OPEN",
            windowType: "command-prompt",
            popupType: null,
            id: uuidv4(),
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1],
            bounds: desktopRef as React.RefObject<HTMLElement>
          });
        } else {
          dispatch({
            type: "FOCUS",
            id: cmdWinId
          });
          dispatch({
            type: "RESTORE",
            id: cmdWinId
          });
        }
        setTicks(ticks + 1);
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [bioOpened, cmdWinId, ticks, desktopRef, dispatch]);

  return (
    <CommandWindow
      commands={COMMANDS.slice(0, ticks)} />
  );
};

export default RedDragon;
