import { useState, useRef, useEffect, forwardRef } from "react";
import { Rnd, type RndDragCallback, type RndResizeCallback } from "react-rnd";

import "./WindowView.css";

export type WindowMenuItem = {
  label: string;
  submenu?: { label: string; icon?: string; disabled?: boolean, onClick?: () => void }[];
};

export type WindowViewProps = {
  title: string;
  icon?: React.ReactNode;
  inactive?: boolean;
  maximized?: boolean;

  x: number;
  y: number;
  width: number;
  height: number;
  z: number;

  resizable?: boolean;
  bounds?: HTMLElement | null;

  onDragStart?: RndDragCallback;
  onDragStop?: RndDragCallback;
  onResizeStop?: RndResizeCallback;
  onMouseDown?: (e: React.MouseEvent) => void;

  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;

  menu?: WindowMenuItem[];
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const WindowView = forwardRef<HTMLDivElement, WindowViewProps>(({
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
  menu = [], // default empty
  onDragStart,
  onDragStop,
  onResizeStop,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  children,
  ...props
}, ref) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Toggle menu on click
  const toggleMenu = (menuLabel: string) => {
    setOpenMenu(prev => (prev === menuLabel ? null : menuLabel));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Rnd
      ref={ref}
      size={{ width, height }}
      position={{ x, y }}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      bounds={bounds || undefined}
      dragHandleClassName="title-bar"
      cancel=".title-bar-controls button"
      minWidth={300}
      minHeight={300}
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
      style={{ zIndex: z }}>
      <div
        {...props}
        className="window c-window-view"
        onMouseDown={onMouseDown}>
        <div
          className={`title-bar ${inactive ? "inactive" : ""}`}
          onDoubleClick={onMaximize}>
          <div className="title-bar-left">
            {icon && <img className="title-bar-icon" src={icon as string} draggable="false" />}
            <div className="title-bar-text">{title}</div>
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onMinimize} />
            <button aria-label={`${maximized ? "Restore" : "Maximize"}`} onClick={onMaximize} />
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>
        {/* Window Menu */}
        {menu.length > 0 && (
          <ul className="c-window__menu" ref={menuRef}>
            {menu.map(item => (
              <li
                key={item.label}
                className={`c-window__menu-item ${openMenu === item.label ? `c-window__menu-item--active` : ''}`}
                onClick={() => toggleMenu(item.label)}>
                {item.label}
                {openMenu === item.label && item.submenu && (
                  <ul className="c-window__submenu window">
                    {item.submenu.map(sub => (
                      <li
                        key={sub.label}
                        className={`c-window__submenu-item ${sub.disabled ? 'c-window__submenu-item--disabled' : ''}`}
                        onClick={() => sub.onClick?.()}>
                        <div className="c-window__submenu-item-icon">
                          { sub.icon ? <img src={sub.icon} /> : null }
                        </div>
                        <span className="c-window__submenu-item-label">{sub.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
        <div 
          className="window-body"
          style={{
            paddingTop: menu.length > 0 ? 0 : undefined
          }}>
          {children}
        </div>
        <div className="status-bar">
          <div className="status-bar-field"></div>
          <div className="status-bar-field status-bar-field--resize"></div>
        </div>
      </div>
    </Rnd>
  );
});

export default WindowView;