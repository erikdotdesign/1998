import { type Action } from "./reducer";
import { type DoomRef } from "./useDoom";

import Menu from "./Menu";
import Button from "./Button";

const CHEATS = [{
  name: "God mode",
  code: "dqd",
  soundEffect: "power-up"
},{
  name: "Full hp, ammo, weapons, armor, keys",
  code: "kfa",
  soundEffect: "ammo"
},{
  name: "Full hp, ammo, weapons, armor",
  code: "fa",
  soundEffect: "ammo"
},{
  name: "Change map detail",
  code: "dt",
  soundEffect: "power-up"
},{
  name: "Chainsaw",
  code: "choppers",
  soundEffect: "chainsaw"
},{
  name: "Walk through walls",
  code: "spispopd",
  soundEffect: "power-up"
}];

const CheatsMenu = ({
  doomRef,
  dispatch
}: {
  doomRef: DoomRef;
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title="Cheats"
      detail="( Only works while playing )"
      dispatch={dispatch}>
      <div className="c-button-group c-button-group--fill c-button-group--column">
        {
          CHEATS.map((cheat) => (
            <Button 
              key={cheat.code}
              text={cheat.name}
              soundEffect={cheat.soundEffect}
              // right="+"
              onClick={() => {
                doomRef.sendCheat(`id${cheat.code}`);
              }} />
          ))
        }
      </div>
    </Menu>
  );
};

export default CheatsMenu;