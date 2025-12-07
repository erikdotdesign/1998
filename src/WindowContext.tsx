import { createContext } from "react";
import type { WindowAction, WindowStore } from "./windowReducer";

export type WindowContextType = {
  windows: WindowStore;
  dispatch: (action: WindowAction) => void;
};

const WindowContext = createContext({
  windows: {},
  dispatch: () => {}
} as WindowContextType);

export default WindowContext;