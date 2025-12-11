import { useState } from "react";
import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';

import "./BioWindow.css";

const BioWindow = () => {
  const { windows, dispatch } = useWindowManager();
  const [bio, setBio] = useState(
    `Erik Myers is a senior product designer who builds the things people didn’t realize they needed — until they can’t imagine working without them. He designs, codes, prototypes, animates, tests, breaks, rebuilds, and then ships the product you actually wanted the first time.
    \nHe’s the creator of btwx, the prototyping and animation desktop app designed for product designers, and the mind behind a growing ecosystem of Figma plugins and widgets used by thousands. If there’s a gap in the workflow, Erik doesn’t wait for a solution — he invents one.
    \nHe’s designed livestream experiences for Fox, e-commerce interfaces seen in billions of Google searches, and first-generation recommendation systems for Twitch that reached over 100 million users. From scrappy startups to multi-platform launches, he brings the same focus: make the complicated feel effortless.
    \nHe moves fluidly between UI/UX, interaction design, front-end engineering, and AI-powered creativity — a hybrid builder who can sketch the idea, wire the logic, and ship the vision.
    \n------------------------------------------\n------------------------------------------\nDON'T CLICK THE POPUPS!\n------------------------------------------\n------------------------------------------`
  );
  const win = Object.values(windows).find(w => w.windowType === "bio");

  if (!win) return;

  return (
    <WindowContainer 
      id={win.id}
      menu={[
        {label: "File", submenu: [{label: "Close", onClick: () => dispatch({type: "CLOSE", id: win.id})}]}, 
        {label: "Edit", submenu: [{label: "Empty", disabled: true}]}, 
        {label: "Help", submenu: [{label: "Empty", disabled: true}]}
      ]}>
      <div className="c-bio-window field-border">
        <textarea 
          className="c-bio-window__text-area"
          value={bio}
          onChange={(e) => setBio(e.target.value)} />
      </div>
    </WindowContainer>
  );
};

export default BioWindow;
