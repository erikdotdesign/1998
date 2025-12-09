import { v4 as uuidv4 } from "uuid";
import type { WindowAction, WindowStore } from "./windowReducer";
import useWindowManager from './WindowManager';
import NoteIcon from "./assets/images/icons/note.png";
import LinkIcon from "./assets/images/icons/link.png";

const DESKTOP_ITEMS = [{
  icon: NoteIcon,
  label: "Bio",
  onClick: (windows: WindowStore, dispatch: (action: WindowAction) => void, bounds: React.RefObject<HTMLElement | null>) => {
    const win = Object.values(windows).find(w => w.windowType === "bio");
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
        windowType: "bio",
        popupType: null,
        x: 0,
        y: 0,
        width: 500,
        height: 700,
        bounds: bounds as React.RefObject<HTMLElement>
      });
    }
  }
},{
  icon: LinkIcon,
  label: "Links",
  onClick: () => {}
}];

const DesktopItems = ({
  desktopRef
}: {
  desktopRef: React.RefObject<HTMLElement | null>;
}) => {
  const { windows, dispatch } = useWindowManager();

  return (
    <div className="c-desktop__items">
      {
        DESKTOP_ITEMS.map((item, i) => (
          <button 
            key={i}
            className="c-desktop__item"
            onClick={() => item.onClick(windows, dispatch, desktopRef)}>
            <img src={item.icon} />
            <p>{item.label}</p>
          </button>
        ))
      }
    </div>
  );
};

export default DesktopItems;