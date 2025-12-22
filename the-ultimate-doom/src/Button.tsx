import React, { forwardRef, ReactNode } from 'react';
import { getModifierClasses } from './helpers';
import { soundManager } from "./soundManager";
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: ReactNode;
  right?: string;
  soundEffect?: string;
  modifier?: string | string[] | undefined;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  text,
  icon,
  right,
  soundEffect,
  modifier,
  ...props
}, ref) => {
  const modifierClasses = getModifierClasses("c-button", modifier);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEffect) soundManager.play(soundEffect);
    if (props.onClick) props.onClick(e);
  }

  return (
    <button
      ref={ref}
      className={`c-button ${right ? "c-button--justify" : null} ${modifierClasses}`}
      {...props}
      onClick={handleClick}>
      {
        icon
        ? <span className='c-button__icon'>{icon}</span>
        : null
      }
      <span className='c-button__text'>{text}</span>
      {right && (
        <div className="c-button__right"><span className='c-button__text'>{right}</span></div>
      )}
    </button>
  )
});

export default Button;