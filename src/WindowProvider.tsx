import { useReducer } from "react";
import WindowContext from "./WindowContext";
import windowReducer from "./windowReducer";

const WindowProvider = ({ 
  children 
}:{
  children: React.ReactNode;
}) => {
  const [windows, dispatch] = useReducer(windowReducer, []);
  return (
    <WindowContext.Provider value={{ windows, dispatch }}>
      {children}
    </WindowContext.Provider>
  );
};

export default WindowProvider;