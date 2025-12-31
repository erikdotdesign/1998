import { useRef } from "react";
import Popups from './Popups';
import Errors from "./Errors";
import DesktopItems from './DesktopItems';
import BioWindow from './BioWindow';
import DoomWindow from "./DoomWindow";
import ThrongletWindow from "./ThrongletWindow";
import PokemonWindow from "./PokemonWindow";
import LinksWindow from './LinksWindow';
import RedDragon from './RedDragon';

import "./Desktop.css";

const Desktop = () => {
  const desktopRef = useRef(null);

  return (
    <div 
      ref={desktopRef}
      className="c-desktop">
      <div className="c-desktop__inner">
        <DesktopItems
          desktopRef={desktopRef} />
        <Popups
          desktopRef={desktopRef} />
        <RedDragon
          desktopRef={desktopRef} />
        <Errors />
        <BioWindow />
        <LinksWindow />
        <DoomWindow />
        <ThrongletWindow />
        <PokemonWindow />
      </div>
    </div>
  );
};

export default Desktop;