import { useEffect, useRef } from "react";
import useWindowManager from "./WindowManager";

const StartBarWindows = ({
  ids,
  scrollRef
}: {
  ids: string[];
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  const { windows, dispatch } = useWindowManager();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const focused = Object.values(windows).find(w => w.focused);
    if (!focused) return;
    if (!scrollRef || !scrollRef.current) return;

    const tabEl = tabRefs.current[focused.id];
    
    if (tabEl) {
      tabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
    }
  }, [windows, scrollRef]);

  return (
    <div className="c-start-bar__windows">
      {
        ids.map((id) => {
          const win = windows[id];
          return (
            <button 
              key={win.id}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ref={el => tabRefs.current[win.id] = el as any}
              className={`c-start-bar__btn c-start-bar__btn--window ${win.focused ? "active" : ''}`} 
              onClick={() => {
                if (win.minimized) {
                  dispatch({
                    type: "RESTORE",
                    id: win.id
                  });
                } else {
                  dispatch({
                    type: "FOCUS",
                    id: win.id
                  });
                }
              }}>
              { win.icon ? <img src={win.icon} /> : null }
              <span>{ win.title }</span>
            </button>
          )
        })
      }
    </div>
  );
};

export default StartBarWindows;