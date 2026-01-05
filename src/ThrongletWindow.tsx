import IFrameWindow from "./IframeWindow";

import "./ThrongletWindow.css";

const ThrongletWindow = () => {
  return (
    <IFrameWindow
      windowType="thronglet"
      iframeSrc="./thronglet/index.html"
      className="c-thronglet-window" />
  );
};

export default ThrongletWindow;
