import WindowView from "./WindowView";
import useWindowManager from "./WindowManager";
import { useEffect } from "react";

const WindowContainer = ({ 
  id,
  children
}: { 
  id: string;
  children: React.ReactNode;
}) => {
  const { windows, dispatch } = useWindowManager();

  const win = windows[id]; // your reducer handles this
  const bounds = win.bounds;

  useEffect(() => {
    if (!bounds.current) return;

    // store previous size
    let prevWidth = bounds.current.offsetWidth;
    let prevHeight = bounds.current.offsetHeight;

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;

        const dx = newWidth - prevWidth;
        const dy = newHeight - prevHeight;

        let newWinX = win.x;
        let newWinY = win.y;

        let newWinWidth = win.width;
        let newWinHeight = win.height;

        if (win.x + win.width > newWidth) {
          newWinX = win.x + dx < 0 ? 0 : win.x + dx
        }

        if (win.y + win.height > newHeight) {
          newWinY = win.y + dy < 0 ? 0 : win.y + dy
        }

        if (newWinX + win.width > newWidth) {
          newWinWidth = newWidth;
        }

        if (newWinY + win.height > newHeight) {
          newWinHeight = newHeight;
        }

        dispatch({
          type: "MOVE",
          id: win.id,
          x: newWinX,
          y: newWinY
        });

        dispatch({
          type: "RESIZE",
          id: win.id,
          width: newWinWidth,
          height: newWinHeight
        });

        // update previous size
        prevWidth = newWidth;
        prevHeight = newHeight;
      }
    });

    ro.observe(bounds.current);

    return () => ro.disconnect();
  }, [bounds, dispatch, win.id, win.x, win.y, win.width, win.height]);

  return (
    win.minimized
    ? null
    : <WindowView
        title={win.title}
        icon={win.icon}
        inactive={!win.focused}
        maximized={win.maximized}
        x={win.x}
        y={win.y}
        width={win.width}
        height={win.height}
        z={win.z}
        resizable={true}
        bounds={bounds.current}

        onMouseDown={() => dispatch({ type: "FOCUS", id })}
        
        onDragStop={(e, d) => {
          dispatch({ type: "MOVE", id, x: d.x, y: d.y });
        }}

        onResizeStop={(e, direction, ref, delta, position) => {
          dispatch({
            type: "RESIZE",
            id,
            width: parseFloat(ref.style.width),
            height: parseFloat(ref.style.height),
          });
          dispatch({
            type: "MOVE",
            id,
            x: position.x,
            y: position.y
          });
        }}

        onMinimize={() => dispatch({ type: "MINIMIZE", id })}
        onMaximize={() => dispatch({ type: "MAXIMIZE", id })}
        onClose={() => dispatch({ type: "CLOSE", id })}>
        {children}
      </WindowView>
  );
};

export default WindowContainer;