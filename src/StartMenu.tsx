import Portfolio98Img from "./assets/images/ui/Portfolio98.png";
import MoreIcon from "./assets/images/ui/more.png";
import ShutDownIcon from "./assets/images/icons/shut-down.png";
import RunIcon from "./assets/images/icons/run.png";
import HelpIcon from "./assets/images/icons/help.png";
import SettingsIcon from "./assets/images/icons/settings.png";
import DocumentsIcon from "./assets/images/icons/documents.png";
import FavoritesIcon from "./assets/images/icons/favorites.png";
import ProgramsIcon from "./assets/images/icons/programs.png";
import SoftwareUpdateIcon from "./assets/images/icons/software-update.png";

import './StartMenu.css';

const START_MENU_ITEMS = [{
  type: "button",
  icon: ShutDownIcon,
  label: "Shut Down"
},{
  type: "divider"
},{
  type: "folder",
  icon: RunIcon,
  label: "Run"
},{
  type: "folder",
  icon: HelpIcon,
  label: "Help"
},{
  type: "folder",
  icon: SettingsIcon,
  label: "Settings"
},{
  type: "folder",
  icon: DocumentsIcon,
  label: "Documents"
},{
  type: "folder",
  icon: FavoritesIcon,
  label: "Favorites"
},{
  type: "folder",
  icon: ProgramsIcon,
  label: "Programs"
},{
  type: "divider"
},{
  type: "button",
  icon: SoftwareUpdateIcon,
  label: "Software Update"
}];

const StartMenu = ({
  startMenuOpen,
}: {
  startMenuOpen: boolean;
}) => {
  return (
    startMenuOpen &&
    <div className='c-start-menu window'>
      <div className='c-start-menu__title-bar'>
        <img src={Portfolio98Img} draggable={false} />
      </div>
      <div className='c-start-menu__items'>
        {
          START_MENU_ITEMS.map((item, i) => (
            <div 
              key={i}
              className={`c-start-menu__item c-start-menu__item--${item.type}`}>
              {
                item.type !== "divider"
                ? <>
                    <img src={item.icon} draggable={false} />
                    <p>{item.label}</p>
                    {
                      item.type === "folder"
                      ? <img src={MoreIcon} draggable={false} />
                      : null
                    }
                  </>
                : null
              }
            </div>
          )).reverse()
        }
      </div>
    </div>
  );
};

export default StartMenu;
