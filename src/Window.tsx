import { Rnd } from "react-rnd";
import { useState, useEffect } from "react";
import "./Window.css";

const Window = ({
  bounds,
  title = "Warning",
  inactive = false,
  icon = null,
  x = 100,
  y = 100,
  z = 1,
  width = 300,
  height = 200,
  resizable = false,
  children,
  onClose,
  ...props
}: {
  bounds: React.RefObject<HTMLElement | null>;
  title?: string;
  inactive?: boolean;
  x?: number;
  y?: number;
  z?: number;
  width?: number;
  height?: number;
  resizable?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [windowState, setWindowState] = useState({
    width, height, x, y
  });


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

        setWindowState(prev => ({
          ...prev,
          x: prev.x + dx < 0 ? 0 : prev.x + dx,
          y: prev.y + dy < 0 ? 0 : prev.y + dy
        }));

        // update previous size
        prevWidth = newWidth;
        prevHeight = newHeight;
      }
    });

    ro.observe(bounds.current);

    return () => ro.disconnect();
  }, [bounds]);

  return (
    <Rnd
      default={{ x: windowState.x, y: windowState.y, width: windowState.width, height: windowState.height }}
      size={{ width: windowState.width,  height: windowState.height }}
      position={{ x: windowState.x, y: windowState.y }}
      onDragStop={(e, d) => { setWindowState({ ...windowState, x: d.x, y: d.y }) }}
      bounds={bounds.current ? bounds.current : undefined}
      minWidth={200}
      minHeight={100}
      dragHandleClassName="title-bar"
      enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:resizable, bottomLeft:false, topLeft:false }}
      resizeHandleClasses={{
        bottomRight: "cursor--resize-br"
      }}
      style={{zIndex: z}}>
      <div 
        className="window c-window"
        {...props}>
        <div className={`title-bar cursor--drag ${inactive ? 'inactive' : ''}`}>
          <div className="title-bar-left">
            {
              icon
              ? <img className="title-bar-icon" src={icon as string} />
              : null
            }
            <div className="title-bar-text">
              {title}
            </div>
          </div>
          <div className="title-bar-controls">
            {/* <button aria-label="Minimize" disabled></button>
            <button aria-label="Maximize" disabled></button> */}
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body">
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;