import { type Action } from "./reducer";
import { type DoomRef } from "./useDoom";

import Menu from "./Menu";
import Button from "./Button";

const POWER_UPS = [{
  name: "Invisibility",
  code: "i"
},{
  name: "Radiation suit",
  code: "r"
},{
  name: "Berserk",
  code: "s"
},{
  name: "Automap",
  code: "a"
},{
  name: "Invulnerability",
  code: "v"
},{
  name: "Light",
  code: "l"
}];

const PowerUpsMenu = ({
  doomRef,
  dispatch
}: {
  doomRef: DoomRef;
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title="Power Ups (Temporary)"
      detail="( Only works while playing )"
      dispatch={dispatch}>
      <div className="c-button-group c-button-group--fill c-button-group--column">
        {
          POWER_UPS.map((powerUp) => (
            <Button 
              key={powerUp.code}
              text={powerUp.name}
              soundEffect={"power-up"}
              // right="+"
              onClick={() => {
                doomRef.sendCheat(`idbehold${powerUp.code}`);
              }} />
          ))
        }
      </div>
    </Menu>
  );
};

export default PowerUpsMenu;