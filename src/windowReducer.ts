import NotepadIcon from "./assets/images/icons/notepad.png";
import LinkIcon from "./assets/images/icons/link.png";
import WarnIcon from "./assets/images/icons/warning.png";
import RedDragonIcon from "./assets/images/icons/red-dragon.png";
import DoomIcon from "./assets/images/icons/doom.png";

export type WindowType = "popup" | "command-prompt" | "bio" | "links" | "doom";
export type WindowPopupType = "bigfoot" | "bug" | "horoscope" | "movies" | "music" | "nessy" | "shop" | "spagett";

export type WindowState = {
  id: string;
  bounds: React.RefObject<HTMLElement>;
  windowType: WindowType;
  popupType: WindowPopupType | null;
  title: string;
  icon: string | null;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  open: boolean;
  minimized: boolean;
  maximized?: boolean;
  prevX?: number;
  prevY?: number;
  prevWidth?: number;
  prevHeight?: number;
  focused: boolean;
};

export type WindowStore = Record<string, WindowState>;

export type WindowAction =
  | { 
      type: "OPEN"; 
      id: string; 
      bounds: React.RefObject<HTMLElement>;
      x: number;
      y: number;
      width: number;
      height: number;
      windowType: WindowType; 
      popupType: WindowPopupType | null
    }
  | { type: "CLOSE"; id: string }
  | { type: "CLOSE_ALL" }
  | { type: "FOCUS"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "MAXIMIZE"; id: string }
  | { type: "RESTORE"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; width: number; height: number }
  | { type: "UPDATE"; id: string; x: number; y: number; width: number; height: number };

let zCounter = 1;

// --------------------------
// Helpers
// --------------------------

const getWindowTitle = (windowType: WindowType, popupType: WindowPopupType | null) => {
  switch (windowType) {
    case "bio":
      return "Bio";
    case "command-prompt":
      return "RED_DRAGON.EXE";
    case "doom":
      return "Doom";
    case "links":
      return "Links";
    case "popup":
      switch (popupType) {
        case "bigfoot":
          return "Bigfoot Found!";
        case "bug":
          return "Virus Detected!";
        case "horoscope":
          return "Your Horoscope!";
        case "movies":
          return "Free Movies!";
        case "music":
          return "Free Music!";
        case "nessy":
          return "Nessy Found!";
        case "shop":
          return "Money Money Money!";
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
  switch (windowType) {
    case "bio":
      return NotepadIcon;
    case "command-prompt":
      return RedDragonIcon;
    case "doom":
      return DoomIcon;
    case "links":
      return LinkIcon;
    case "popup":
      return WarnIcon;
    default:
      return null;
  }
};

const focusOnly = (id: string, store: WindowStore): WindowStore => {
  const next: WindowStore = {};

  for (const wId in store) {
    next[wId] = {
      ...store[wId],
      focused: wId === id
    };
  }

  return next;
};

// --------------------------
// Reducer
// --------------------------

const windowReducer = (state: WindowStore, action: WindowAction): WindowStore => {
  switch (action.type) {
    case "OPEN": {
      const newState: WindowStore = {
        ...state,
        [action.id]: {
          id: action.id,
          bounds: action.bounds,
          windowType: action.windowType,
          popupType: action.popupType,
          title: getWindowTitle(action.windowType, action.popupType),
          icon: getWindowIcon(action.windowType),
          x: action.x,
          y: action.y,
          width: action.width,
          height: action.height,
          z: ++zCounter,
          open: true,
          minimized: false,
          focused: true,
          maximized: false
        },
      };

      return focusOnly(action.id, newState);
    }

    case "CLOSE": {
      const newState: WindowStore = { ...state };
      const wasFocused = newState[action.id]?.focused;

      delete newState[action.id];

      // If the closed window was focused, focus the next top-most
      if (wasFocused) {
        const remaining = Object.values(newState);
        if (remaining.length > 0) {
          const top = remaining.sort((a, b) => b.z - a.z)[0];
          newState[top.id] = { ...top, focused: true };
        }
      }

      return newState;
    }

    case "CLOSE_ALL": {
      return {};
    }

    case "FOCUS": {
      const target = state[action.id];
      if (!target) return state;

      const newZ = ++zCounter;

      const newState: WindowStore = {};
      for (const id in state) {
        newState[id] = {
          ...state[id],
          focused: id === action.id,
          z: id === action.id ? newZ : state[id].z
        };
      }

      return newState;
    }

    case "MINIMIZE": {
      const target = state[action.id];
      if (!target) return state;

      const newState: WindowStore = {
        ...state,
        [action.id]: { ...target, minimized: true, focused: false }
      };

      // focus the next top-most non-minimized window
      const topNotMinimized = Object.values(newState)
        .filter(w => !w.minimized)
        .sort((a, b) => b.z - a.z)[0];

      if (topNotMinimized) {
        newState[topNotMinimized.id] = {
          ...topNotMinimized,
          focused: true
        };
      }

      return newState;
    }

    case "MAXIMIZE": {
      const w = state[action.id];
      if (!w) return state;

      const isRestoring = w.maximized === true;

      // Restore from maximize
      if (isRestoring) {
        const newState: WindowStore = {
          ...state,
          [action.id]: {
            ...w,
            maximized: false,
            focused: true,
            z: ++zCounter,
            x: w.prevX ?? w.x,
            y: w.prevY ?? w.y,
            width: w.prevWidth ?? w.width,
            height: w.prevHeight ?? w.height,
          }
        };

        return focusOnly(action.id, newState);
      }

      // Maximize window
      const newState: WindowStore = {
        ...state,
        [action.id]: {
          ...w,
          maximized: true,
          focused: true,
          z: ++zCounter,

          // store previous dimensions
          prevX: w.x,
          prevY: w.y,
          prevWidth: w.width,
          prevHeight: w.height,

          // maximize to bounds
          x: 0,
          y: 0,
          width: w.bounds.current.offsetWidth,
          height: w.bounds.current.offsetHeight,
        }
      };

      return focusOnly(action.id, newState);
    }

    case "RESTORE": {
      const target = state[action.id];
      if (!target) return state;

      const newState: WindowStore = {
        ...state,
        [action.id]: {
          ...target,
          minimized: false,
          focused: true,
          z: ++zCounter,
        }
      };

      return focusOnly(action.id, newState);
    }

    case "MOVE": {
      const target = state[action.id];
      if (!target) return state;

      return {
        ...state,
        [action.id]: { ...target, x: action.x, y: action.y }
      };
    }

    case "RESIZE": {
      const target = state[action.id];
      if (!target) return state;

      return {
        ...state,
        [action.id]: { ...target, width: action.width, height: action.height }
      };
    }

    case "UPDATE": {
      const target = state[action.id];
      if (!target) return state;

      return {
        ...state,
        [action.id]: { ...target, x: action.x, y: action.y, width: action.width, height: action.height }
      };
    }

    default:
      return state;
  }
};

export default windowReducer;