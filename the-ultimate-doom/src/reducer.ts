export type Menu = "cheats" | "power-ups" | "controls" | "episodes" | "maps-1" | "maps-2" | "maps-3" | "maps-4" | "music" | "restart";

export type Status = "idle" | "loading" | "ready" | "error";

export type LoadProgress = {
  stage: string;
  loaded: number;
}

export type State = {
  status: Status;
  loadProgress: LoadProgress | null;
  error: string | null,
  menu: Menu | null;
};

export type Action = 
  | { type: "START_LOADING" }
  | { type: "SET_LOAD_PROGRESS", loadProgress: LoadProgress }
  | { type: "SET_READY" }
  | { type: "SET_ERROR", error: string | null } 
  | { type: "OPEN_MENU"; menu: Menu }
  | { type: "CLOSE_MENU" }
  

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_LOADING": return { ...state, status: "loading", error: null };
    case "SET_LOAD_PROGRESS": return { ...state, loadProgress: action.loadProgress };
    case "SET_READY": return { ...state, status: "ready", error: null };
    case "SET_ERROR": return { ...state, status: "error", error: action.error };
    case "OPEN_MENU":
      return { ...state, menu: action.menu };
    case "CLOSE_MENU":
      return { ...state, menu: null };
    default: return state;
  }
};

export default reducer;