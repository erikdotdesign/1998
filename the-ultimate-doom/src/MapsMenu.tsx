import { type Action } from "./reducer";
import { type DoomRef } from "./useDoom";

import Menu from "./Menu";
import Button from "./Button";
import { EPISODES } from "./EpisodesMenu";

const MAPS_1 = ["Hangar", "Nuclear Plant", "Toxin Refinery", "Command Control", "Phobos Lab", "Central Processing", "Computer Station", "Phobos Anomaly", "Military Base (Secret)"];
const MAPS_2 = ["Deimos Anomaly", "Containment Area", "Refinery", "Deimos Lab", "Command Center", "Halls of the Damned", "Spawning Vats", "Tower of Babel", "Fortress of Mystery (Secret)"];
const MAPS_3 = ["Hell Keep", "Slough of Despair", "Pandemonium", "House of Pain", "Unholy Cathedral", "Mt. Erebus", "Limbo", "Dis", "Warrens (Secret)"];
const MAPS_4 = ["Hell Beneath", "Perfect Hatred", "Sever the Wicked", "Unruly Evil", "They Will Repent", "Against Thee Wickedly", "And Hell Followed", "Unto the Cruel", "Fear (Secret)"];
const MAPS = [MAPS_1, MAPS_2, MAPS_3, MAPS_4];

const MapsMenu = ({
  episode,
  doomRef,
  dispatch
}: {
  episode: number,
  doomRef: DoomRef;
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title={EPISODES[episode - 1]}
      detail="( Only works while playing )"
      handleBack={() => {
        dispatch({
          type: "OPEN_MENU",
          menu: "episodes"
        })
      }}
      dispatch={dispatch}>
      <div className="c-button-group c-button-group--fill c-button-group--column">
        {
          MAPS[episode - 1].map((map, i) => (
            <Button 
              key={i}
              text={map}
              soundEffect={"teleport"}
              // right="►"
              onClick={() => {
                const code = `idclev${episode}${i + 1}`;
                doomRef.sendCheat(code);
                dispatch({
                  type: "CLOSE_MENU"
                });
              }} />
          ))
        }
      </div>
    </Menu>
  );
};

export default MapsMenu;