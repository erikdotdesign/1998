import TermIcon from "./assets/images/icons/term.png";
import LogoIcon from "./assets/images/icons/logo.png";
import WarnIcon from "./assets/images/icons/warning.png";

export type WindowType = "popup" | "command-prompt" | "portfolio";

export type WindowPopupType = "bigfoot" | "bug" | "horoscope" | "movies" | "shop" | "spagett" | null;

export type WindowState = {
  id: string;
  windowType: WindowType;
  popupType: WindowPopupType;
  title: string;
  icon: string | null;
  z: number;
  open: boolean;
  minimized: boolean;
  focused: boolean;
};

export type WindowAction =
  | { type: "OPEN"; id: string, windowType: WindowType, popupType: WindowPopupType }
  | { type: "CLOSE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "RESTORE"; id: string };

let zCounter = 1;

const windowReducer = (state: WindowState[], action: WindowAction) => {

  const focusOnly = (id: string, nextState: WindowState[]) =>
    nextState.map(w =>
      w.id === id
        ? { ...w, focused: true }
        : { ...w, focused: false }
    );

  const getWindowTitle = (windowType: WindowType, popupType: WindowPopupType) => {
    switch(windowType) {
      case "portfolio":
        return "Erik.exe";
      case "command-prompt":
        return "Command Prompt";
      case "popup":
        switch(popupType) {
          case "bigfoot":
            return "Bigfoot Found!";
          case "bug":
            return "Free Bug Scan!";
          case "horoscope":
            return "Free Horoscope!";
          case "movies":
            return "Free Movies!";
          case "shop":
            return "Free Money!";
          case "spagett":
            return "Join Church of Spagett!";
          default:
            return "Popup";
        }
      default:
        return "Window";
    }
  };

  const getWindowIcon = (windowType: WindowType) => {
    switch(windowType) {
      case "command-prompt":
        return TermIcon;
      case "portfolio":
        return LogoIcon;
      case "popup":
        return WarnIcon;
      default:
        return null;
    }
  };

  switch (action.type) {
    case "OPEN": {
      const next = [
        ...state.filter(w => w.id !== action.id),
        {
          id: action.id,
          windowType: action.windowType,
          popupType: action.popupType,
          title: getWindowTitle(action.windowType, action.popupType),
          icon: getWindowIcon(action.windowType),
          z: ++zCounter,
          open: true,
          minimized: false,
          focused: true,
        },
      ];
      return focusOnly(action.id, next);
    }

    case "CLOSE": {
      const next = state.filter(w => w.id !== action.id);

      // If the closed window was focused, focus the top-most other window
      if (next.every(w => !w.focused)) {
        const top = [...next].sort((a, b) => b.z - a.z)[0];
        if (top) top.focused = true;
      }

      return next;
    }

    case "FOCUS": {
      const next = state.map(w =>
        w.id === action.id ? { ...w, z: ++zCounter } : w
      );
      return focusOnly(action.id, next);
    }

    case "MINIMIZE": {
      const next = state.map(w =>
        w.id === action.id
          ? { ...w, minimized: true, focused: false }
          : w
      );

      // Focus the next-highest z window
      const top = next
        .filter(w => !w.minimized)
        .sort((a, b) => b.z - a.z)[0];
      if (top) top.focused = true;

      return next;
    }

    case "RESTORE": {
      const next = state.map(w =>
        w.id === action.id
          ? { ...w, minimized: false, focused: true, z: ++zCounter }
          : w
      );
      return focusOnly(action.id, next);
    }

    default:
      return state;
  }
};

export default windowReducer;