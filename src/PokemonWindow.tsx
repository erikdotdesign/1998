import IFrameWindow from "./IframeWindow";

import "./PokemonWindow.css";

const PokemonWindow = () => {
  return (
    <IFrameWindow
      windowType="pokemon"
      iframeSrc="./pokemon-sv-151/index.html"
      className="c-pokemon-window" />
  );
};

export default PokemonWindow;
