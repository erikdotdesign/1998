import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./CommandWindow.css";

const CommandWindow = ({
  commands
}: {
  commands: string[];
}) => {
  const { windows, dispatch } = useWindowManager();
  const win = Object.values(windows).find(w => w.windowType === "command-prompt");

  if (!win) return;

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-command-window">
        <pre 
          className="c-command-window__pre">
          {
            commands.map((command, i) => (
              <div key={i}>{`C:\\> ${command}`}</div>
            ))
          }
        </pre>
      </div>
    </WindowContainer>
  );
};

export default CommandWindow;
