import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

import ClippyImg from "./assets/images/clippy/clippy.webp";
import CloseIcon from "./assets/images/ui/close.svg";

import "./Clippy.css";

const CLIPPY_TIPS = [
  "Hey! Welcome to Erik's portfolio. I’d start with his bio—it’s a good intro!",
  "Want to see the magic behind the scenes? Links let you explore his designs (Dribbble), code (GitHub), plugins & widgets (Figma), and LinkedIn for the professional scoop.",
  "Feeling curious? Click Doom, Thronglet, or Pokemon for interactive demos!"
];

const Clippy = () => {
  const [visible, setVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTips, setShowTips] = useState(false);

  const clippySpring = useSpring({
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0%)" },
    delay: 1000,
    onRest: () => setShowTips(true)
  });

  const tipsSpring = useSpring({
    opacity: showTips ? 1 : 0,
    transform: showTips ? "scale(1)" : "scale(0.8)",
    config: { tension: 200, friction: 20 },
  });

  if (!visible) return null;

  return (
    <animated.div style={clippySpring} className="c-clippy">
      <animated.div style={tipsSpring} className="c-clippy__tips">
        <div className="c-clippy__tips-content">
          <p className="c-clippy__tips-body">{CLIPPY_TIPS[tipIndex]}</p>
          <div className="c-clippy__tips-footer">
            <button 
              className="c-clippy__button"
              disabled={tipIndex === 0} 
              onClick={() => setTipIndex(tipIndex - 1)}
              data-analytics={`clippy_tip-${(tipIndex + 1) - 1}`}>
              Prev
            </button>
            <p>{tipIndex + 1} of {CLIPPY_TIPS.length}</p>
            <button 
              className="c-clippy__button"
              disabled={tipIndex === CLIPPY_TIPS.length - 1} 
              onClick={() => setTipIndex(tipIndex + 1)}
              data-analytics={`clippy_tip-${(tipIndex + 1) + 1}`}>
              Next
            </button>
          </div>
        </div>
        <button 
          className="c-clippy__button c-clippy__button--close"
          onClick={() => setVisible(false)}
          data-analytics={`clippy_close`}>
          <img src={CloseIcon} alt="Close" />
        </button>
      </animated.div>
      <img className="c-clippy__img" src={ClippyImg} alt="Clippy" />
    </animated.div>
  );
};

export default Clippy;