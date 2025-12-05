import { useContext } from "react";

import WindowContext from "./WindowContext";

const useWindowManager = () => {
  return useContext(WindowContext);
};

export default useWindowManager;