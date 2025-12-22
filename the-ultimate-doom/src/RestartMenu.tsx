import { type Action } from "./reducer";
import { type DoomRef } from "./useDoom";

import Menu from "./Menu";
import Button from "./Button";

const RestartMenu = ({
  doomRef,
  dispatch
}: {
  doomRef: DoomRef;
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title="Restart"
      detail="Are you sure you want to restart?"
      dispatch={dispatch}>
      <div className="c-button-group c-button-group--fill c-button-group--column">
        <div className="c-button-group">
          <Button 
            text="Yes"
            modifier="center"
            onClick={() => {
              dispatch({
                type: "CLOSE_MENU"
              })
              doomRef.restart();
            }} />
          <Button 
            text="No"
            modifier="center"
            onClick={() => {
              dispatch({
                type: "CLOSE_MENU"
              })
            }} />
        </div>
      </div>
    </Menu>
  );
};

export default RestartMenu;