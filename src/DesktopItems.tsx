import { v4 as uuidv4 } from "uuid";
import type { WindowType } from "./windowReducer";
import useWindowManager from './WindowManager';
import NoteIcon from "./assets/images/icons/note.png";
import LinkIcon from "./assets/images/icons/link.png";

const DESKTOP_ITEMS = [{
  icon: NoteIcon,
  label: "Bio",
  windowType: "bio",
  size: [500, 700]
},{
  icon: LinkIcon,
  label: "Links",
  windowType: "links",
  size: [500, 300]
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
      dispatch({
        type: "OPEN",
        id: uuidv4(),
        windowType: windowType,
        popupType: null,
        x: 0,
        y: 0,
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