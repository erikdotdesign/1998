import { type Action, type Menu as MenuType } from "./reducer";

import Menu from "./Menu";
import Button from "./Button";

// eslint-disable-next-line react-refresh/only-export-components
export const EPISODES = [
  "Knee-Deep in the Dead",
  "The Shores of Hell",
  "Inferno",
  "Thy Flesh Consumed"
];

const EpisodesMenu = ({
  dispatch
}: {
  dispatch: (action: Action) => void;
}) => {
  return (
    <Menu
      title="Levels"
      dispatch={dispatch}>
      <div className="c-button-group c-button-group--fill c-button-group--column">
        {
          EPISODES.map((episode, i) => (
            <Button 
              key={i}
              text={episode}
              right=">"
              onClick={() => {
                dispatch({
                  type: "OPEN_MENU",
                  menu: `maps-${i + 1}` as MenuType
                })
              }} />
          ))
        }
      </div>
    </Menu>
  );
};

export default EpisodesMenu;