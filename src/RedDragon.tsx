import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
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
          dispatch({
            type: "OPEN",
            windowType: "command-prompt",
            popupType: null,
            id: uuidv4(),
            x: 0,
            y: 0,
            width: 500,
            height: 400,
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
