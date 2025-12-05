import { createContext } from "react";
import type { WindowState, WindowAction } from "./windowReducer";

export type WindowContextType = {
  windows: WindowState[];
  dispatch: (action: WindowAction) => void;
};

const WindowContext = createContext({
  windows: [],
  dispatch: () => {}
} as WindowContextType);

export default WindowContext;