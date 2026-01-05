import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import PaintIcon from "./assets/images/icons/paint.png";
import TerminalIcon from "./assets/images/icons/term.png";
import ToolsIcon from "./assets/images/icons/tools.png";
import UsersIcon from "./assets/images/icons/users.png";

import "./LinksWindow.css";

const LINKS = [{
  icon: PaintIcon,
  label: "Dribbble",
  link: "https://dribbble.com/erikdotdesign"
},{
  icon: TerminalIcon,
  label: "Github",
  link: "https://github.com/erikdotdesign"
},{
  icon: ToolsIcon,
  label: "Figma",
  link: "https://figma.com/@erikdotdesign"
},{
  icon: UsersIcon,
  label: "LinkedIn",
  link: "https://linkedin.com/in/erikmyers"
}];

const LinksWindow = () => {
  const { windows, dispatch } = useWindowManager();
  const win = Object.values(windows).find(w => w.windowType === "links");

  if (!win) return;

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-links-window field-border">
        <div className="c-links-window__wrapper">
          <div className="c-links-window__links">
            {
              LINKS.map((link, i) => (
                <a 
                  key={i}
                  className="c-links-window__link"
                  href={link.link}
                  target="_blank"
                  data-analytics={`link_${link.label.toLowerCase()}`}>
                  <img src={link.icon} />
                  <p>{link.label}</p>
                </a>
              ))
            }
          </div>
        </div>
      </div>
    </WindowContainer>
  );
};

export default LinksWindow;
