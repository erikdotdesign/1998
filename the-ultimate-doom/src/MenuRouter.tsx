import { useEffect, useRef } from "react";
import { type Action, type State } from "./reducer";
import "./Menu.css";
import { type DoomRef } from "./useDoom";
import CheatsMenu from "./CheatsMenu";
import PowerUpsMenu from "./PowerUpsMenu";
import ControlsMenu from "./ControlsMenu";
import EpisodesMenu from "./EpisodesMenu";
import MapsMenu from "./MapsMenu";
import MusicMenu from "./MusicMenu";
import RestartMenu from "./RestartMenu";
import { soundManager } from "./soundManager";

const MenuRouter = ({
  doomRef,
  dispatch,
  state
}: {
  doomRef: DoomRef;
  dispatch: (action: Action) => void;
  state: State;
}) => {
  const prevMenuRef = useRef<string | null>(null);

  useEffect(() => {
    const prevMenu = prevMenuRef.current;
    const nextMenu = state.menu;

    // Handle transitions
    if (prevMenu === null && nextMenu !== null) {
      // Opening the first menu
      soundManager.play("switch-on");
    } else if (prevMenu !== null && nextMenu === null) {
      // Closing all menus
      soundManager.play("switch-off");
    } else if (prevMenu !== nextMenu) {
      // Switching between menus
      soundManager.play("switch-on");
    }

    prevMenuRef.current = nextMenu;
  }, [state.menu]);

  switch (state.menu) {
    case "cheats":
      return <CheatsMenu doomRef={doomRef} dispatch={dispatch} />;
    case "power-ups":
      return <PowerUpsMenu doomRef={doomRef} dispatch={dispatch} />;
    case "controls":
      return <ControlsMenu dispatch={dispatch} />;
    case "episodes":
      return <EpisodesMenu dispatch={dispatch} />;
    case "maps-1":
    case "maps-2":
    case "maps-3":
    case "maps-4":
      return (
        <MapsMenu
          episode={Number(state.menu.charAt(state.menu.length - 1))}
          doomRef={doomRef}
          dispatch={dispatch} />
      );
    case "music":
      return <MusicMenu doomRef={doomRef} dispatch={dispatch} />;
    case "restart":
      return <RestartMenu doomRef={doomRef} dispatch={dispatch} />;
    default:
      return null;
  }
};

export default MenuRouter;