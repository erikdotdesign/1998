import { v4 as uuidv4 } from "uuid";
import { centerPosition } from "./helpers";
import type { WindowType } from "./windowReducer";
import useWindowManager from './WindowManager';
import NoteIcon from "./assets/images/icons/note.png";
import LinkIcon from "./assets/images/icons/link.png";
import DoomIcon from "./assets/images/icons/doom.png";
import ThrongletIcon from "./assets/images/icons/thronglet.png";
import PokemonIcon from "./assets/images/icons/pokemon-sv-151.png";

const DESKTOP_ITEMS = [{
  icon: NoteIcon,
  label: "Bio",
  windowType: "bio",
  size: [500, 700]
},{
  icon: LinkIcon,
  label: "Links",
  windowType: "links",
  size: [448, 300]
},{
  icon: DoomIcon,
  label: "Doom",
  windowType: "doom",
  size: [600, 530]
},{
  icon: ThrongletIcon,
  label: "Thronglet",
  windowType: "thronglet",
  size: [509, 595]
},{
  icon: PokemonIcon,
  label: "151",
  windowType: "pokemon",
  size: [509, 595]
}];

const DesktopItems = ({
  desktopRef
}: {
  desktopRef: React.RefObject<HTMLElement | null>;
}) => {
  const { windows, dispatch } = useWindowManager();

  const handleClick = (windowType: WindowType, size: number[]) => {
    const win = Object.values(windows).find(w => w.windowType === windowType);
    if (win) {
      if (win.minimized) {
        dispatch({
          type: "RESTORE",
          id: win.id
        });
      } else {
        dispatch({
          type: "FOCUS",
          id: win.id
        });
      }
    } else {
      const position = centerPosition(desktopRef, size[0], size[1]);
      dispatch({
        type: "OPEN",
        id: uuidv4(),
        windowType: windowType,
        popupType: null,
        x: position[0],
        y: position[1],
        width: size[0],
        height: size[1],
        bounds: desktopRef as React.RefObject<HTMLElement>
      });
    }
  }

  return (
    <div className="c-desktop__items">
      {
        DESKTOP_ITEMS.map((item, i) => (
          <button 
            key={i}
            className="c-desktop__item"
            onClick={() => handleClick(item.windowType as WindowType, item.size)}>
            <img src={item.icon} />
            <p>{item.label}</p>
          </button>
        ))
      }
    </div>
  );
};

export default DesktopItems;