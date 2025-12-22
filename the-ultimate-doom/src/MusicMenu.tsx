import { type Action } from "./reducer";
import { type DoomRef } from "./useDoom";

import Menu from "./Menu";
import Button from "./Button";

const TRACKS = [{
  name: "At Doom's Gate",
  code: 11,
},{
  name: "The Imp's Song",
  code: 12
},{
  name: "Dark Halls",
  code: 13,
},{
  name: "Kitchen Ace (And Taking Names)",
  code: 14,
},{
  name: "Suspense",
  code: 15
},{
  name: "On the Hunt",
  code: 16
},{
  name: "Demons on the Prey",
  code: 17
},{
  name: "Sign of Evil",
  code: 18
},{
  name: "Hiding the Secrets",
  code: 19
},{
  name: "I Sawed the Demons",
  code: 21
},{
  name: "The Demons from Adrian's Pen",
  code: 22
},{
  name: "Intermission from DOOM",
  code: 23
},{
  name: "They're Going to Get You",
  code: 24
},{
  name: "Sinister",
  code: 26
},{
  name: "Waltz of the Demons",
  code: 27
},{
  name: "Nobody Told Me About id",
  code: 28
},{
  name: "Untitled",
  code: 29
},{
  name: "Donna to the Rescue",
  code: 32
},{
  name: "Deep Into the Code",
  code: 33
},{
  name: "Facing the Spider",
  code: 38
}];

const MusicMenu = ({
  doomRef,
  dispatch
}: {
  doomRef: DoomRef;
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title="Music"
      detail="( Only works while playing )"
      dispatch={dispatch}>
      <div className="c-button-group c-button-group--fill c-button-group--column">
        {
          TRACKS.map((track, i) => (
            <Button 
              key={i}
              text={track.name}
              soundEffect={"shot"}
              // right="►"
              onClick={() => {
                const code = `idmus${track.code}`;
                doomRef.sendCheat(code);
              }} />
          ))
        }
      </div>
    </Menu>
  );
};

export default MusicMenu;