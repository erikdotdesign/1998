import { Rnd, type RndDragCallback, type RndResizeCallback } from "react-rnd";

import "./WindowView.css";

export type WindowViewProps = {
  title: string;
  icon?: React.ReactNode;
  inactive?: boolean;
  maximized?: boolean;

  // controlled state
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;

  resizable?: boolean;
  bounds?: HTMLElement | null;

  // event handlers exposed to parent
  onDragStop?: RndDragCallback;
  onResizeStop?: RndResizeCallback;
  onMouseDown?: (e: React.MouseEvent) => void;

  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;

  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const WindowView = ({
  title,
  icon,
  inactive = false,
  maximized = false,
  x,
  y,
  width,
  height,
  z,
  resizable = false,
  bounds,

  // events
  onDragStop,
  onResizeStop,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,

  children,
  ...props
}: WindowViewProps) => {

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      bounds={bounds || undefined}
      dragHandleClassName="title-bar"
      cancel=".title-bar-controls button"
      minWidth={300}
      minHeight={400}
      enableResizing={{
        bottomRight: resizable,
        bottom: resizable,
        top: resizable,
        left: resizable,
        right: resizable,
        topRight: resizable,
        topLeft: resizable,
        bottomLeft: resizable,
      }}
      resizeHandleClasses={{ 
        bottomRight: "cursor--resize-nwse", 
        topLeft: "cursor--resize-nwse",
        topRight: "cursor--resize-nesw",
        bottomLeft: "cursor--resize-nesw",
        top: "cursor--resize-ns",
        bottom: "cursor--resize-ns",
        left: "cursor--resize-ew",
        right: "cursor--resize-ew",
      }}
      resizeHandleStyles={{
        bottomRight: { width: "24px", height: "24px" },
        bottomLeft: { width: "24px", height: "24px" },
        topLeft: { width: "24px", height: "24px" },
        topRight: { width: "24px", height: "24px" },
      }}
      style={{ zIndex: z }}>
      <div
        {...props}
        className="window c-window-view"
        onMouseDown={onMouseDown}>
        <div 
          className={`title-bar ${inactive ? "inactive" : ""}`}
          onDoubleClick={onMaximize}>
          <div className="title-bar-left">
            {icon ? <img className="title-bar-icon" src={icon as string} draggable="false" /> : null}
            <div className="title-bar-text">{title}</div>
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onMinimize} />
            <button aria-label={`${maximized ? "Restore" : "Maximize"}`} onClick={onMaximize} />
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <div className="window-body">{children}</div>
        <div className="status-bar">
          <div className="status-bar-field"></div>
          <div className="status-bar-field status-bar-field--resize"></div>
        </div>
      </div>
    </Rnd>
  );
};

export default WindowView;