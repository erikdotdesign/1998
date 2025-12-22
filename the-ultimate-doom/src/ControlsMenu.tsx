import { type Action } from "./reducer";

import Menu from "./Menu";

const CONTROLS = [{
  name: "Move",
  key: "Up, Down, Left, Right"
},{
  name: "Use",
  key: "W"
},{
  name: "Fire",
  key: "S"
},{
  name: "Strafe",
  key: "A, D"
},{
  name: "Strafe on",
  key: "Alt"
},{
  name: "Speed on",
  key: "Space"
},{
  name: "Map",
  key: "Tab"
},{
  name: "Death transition",
  key: "W"
},{
  name: "Map transition",
  key: "W"
},{
  name: "Main Menu",
  key: "Escape"
},{
  name: "Navigate",
  key: "Up, Down, Left, Right, Enter"
}];

const ControlsMenu = ({
  dispatch
}: {
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title="Controls"
      detail="( Game save/load not supported )"
      dispatch={dispatch}>
      <div className="c-menu__text-block">
        {
          CONTROLS.map((control) => (
            <div>
              <span>{control.name}</span>
              <span>{control.key}</span>
            </div>
          ))
        }
      </div>
    </Menu>
  );
};

export default ControlsMenu;