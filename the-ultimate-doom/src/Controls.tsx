import Button from "./Button";
import { type Action, type State } from "./reducer";

import "./Controls.css";

const Controls = ({
  state,
  dispatch
}: {
  state: State;
  dispatch: (action: Action) => void;
}) => {
  return (
    <div className="c-controls">
      <div className="c-button-group">
        <Button
          text="Controls"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 22H8V20H16V22Z" />
              <path d="M8 20H6V18H8V20Z" />
              <path d="M18 20H16V18H18V20Z" />
              <path d="M6 18H4V16H6V18Z" />
              <path d="M20 18H18V16H20V18Z" />
              <path d="M13 17H11V11H13V17Z" />
              <path d="M2 8H4V16H2V8Z" />
              <path d="M22 16H20V8H22V16Z" />
              <path d="M13 9H11V7H13V9Z" />
              <path d="M6 8H4V6H6V8Z" />
              <path d="M20 8H18V6H20V8Z" />
              <path d="M8 6H6V4H8V6Z" />
              <path d="M18 6H16V4H18V6Z" />
              <path d="M16 4H8V2H16V4Z" />
            </svg>
          }
          modifier={state.menu === "controls" ? "active" : undefined}
          onClick={() => {
            if (state.menu === "controls") {
              dispatch({
                type: "CLOSE_MENU"
              })
            } else {
              dispatch({
                type: "OPEN_MENU",
                menu: "controls"
              }) 
            }
          }} />
        <Button
          text="Restart"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 22H8V20H16V22Z" />
              <path d="M8 20H6V18H8V20Z" />
              <path d="M18 20H16V18H18V20Z" />
              <path d="M6 18H4V16H6V18Z" />
              <path d="M20 18H18V16H20V18Z" />
              <path d="M4 14V16H2V14H4Z" />
              <path d="M22 16H20V8H22V16Z" />
              <path d="M4 4H8V8H10V10H2V2H4V4Z" />
              <path d="M20 8H18V6H20V8Z" />
              <path d="M18 6H16V4H18V6Z" />
              <path d="M16 4H8V2H16V4Z" />
            </svg>
          }
          modifier={state.menu === "restart" ? "active" : undefined}
          onClick={() => {
            if (state.menu === "restart") {
              dispatch({
                type: "CLOSE_MENU"
              })
            } else {
              dispatch({
                type: "OPEN_MENU",
                menu: "restart"
              }) 
            }
          }} />
      </div>
      <div className="c-button-group">
        <Button
          text="Cheats"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 23H10V21H14V23Z" />
              <path d="M10 21H8V19H10V21Z" />
              <path d="M16 21H14V19H16V21Z" />
              <path d="M8 19H6V17H8V19Z" />
              <path d="M18 19H16V17H18V19Z" />
              <path d="M6 17H4V15H6V17Z" />
              <path d="M20 17H18V15H20V17Z" />
              <path d="M4 15H2V13H4V15Z" />
              <path d="M22 15H20V13H22V15Z" />
              <path d="M0 5H2V13H0V5Z" />
              <path d="M24 13H22V5H24V13Z" />
              <path d="M6 11H4V7H6V11Z" />
              <path d="M8 7H6V5H8V7Z" />
              <path d="M4 5H2V3H4V5Z" />
              <path d="M14 5H10V3H14V5Z" />
              <path d="M22 5H20V3H22V5Z" />
              <path d="M10 3H4V1H10V3Z" />
              <path d="M20 3H14V1H20V3Z" />
            </svg>
          }
          modifier={state.menu === "cheats" ? "active" : undefined}
          onClick={() => {
            if (state.menu === "cheats") {
              dispatch({
                type: "CLOSE_MENU"
              })
            } else {
              dispatch({
                type: "OPEN_MENU",
                menu: "cheats"
              }) 
            }
          }} />
        <Button
          text="Power Ups"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H13V23H7V17H9V21Z" />
              <path d="M15 21H13V19H15V21Z" />
              <path d="M17 19H15V17H17V19Z" />
              <path d="M11 17H9V15H11V17Z" />
              <path d="M19 17H17V15H19V17Z" />
              <path d="M13 15H11V13H13V15Z" />
              <path d="M21 15H19V11H15V9H21V15Z" />
              <path d="M11 13H5V11H11V13Z" />
              <path d="M5 11H3V7H5V11Z" />
              <path d="M15 9H13V7H15V9Z" />
              <path d="M7 7H5V5H7V7Z" />
              <path d="M17 7H15V5H17V7Z" />
              <path d="M9 5H7V3H9V5Z" />
              <path d="M19 5H17V3H9V1H19V5Z" />
            </svg>
          }
          modifier={state.menu === "power-ups" ? "active" : undefined}
          onClick={() => {
            if (state.menu === "power-ups") {
              dispatch({
                type: "CLOSE_MENU"
              })
            } else {
              dispatch({
                type: "OPEN_MENU",
                menu: "power-ups"
              }) 
            }
          }} />
      </div>
      <div className="c-button-group">
        <Button
          text="Music"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 22H2V20H8V22Z" />
              <path d="M22 22H16V20H22V22Z" />
              <path d="M2 20H0V16H2V20Z" />
              <path d="M10 20H8V16H10V20Z" />
              <path d="M16 20H14V16H16V20Z" />
              <path d="M24 20H22V16H24V20Z" />
              <path d="M8 8H20V4H22V16H16V14H20V10H8V16H2V14H6V4H8V8Z" />
              <path d="M20 4H8V2H20V4Z" />
            </svg>
          }
          modifier={state.menu === "music" ? "active" : undefined}
          onClick={() => {
            if (state.menu === "music") {
              dispatch({
                type: "CLOSE_MENU"
              })
            } else {
              dispatch({
                type: "OPEN_MENU",
                menu: "music"
              }) 
            }
          }} />
        <Button
          text="Levels"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 22H8V20H16V22Z" />
              <path d="M15 16H13V18H11V16H9V14H15V16Z" />
              <path d="M9 14H7V12H9V14Z" />
              <path d="M17 14H15V12H17V14Z" />
              <path d="M7 12H5V6H7V12Z" />
              <path d="M19 12H17V6H19V12Z" />
              <path d="M14 11H10V7H14V11Z" />
              <path d="M9 6H7V4H9V6Z" />
              <path d="M17 6H15V4H17V6Z" />
              <path d="M15 4H9V2H15V4Z" />
            </svg>
          }
          modifier={state.menu === "episodes" || state.menu?.startsWith("maps") ? "active" : undefined}
          onClick={() => {
            if (state.menu === "episodes") {
              dispatch({
                type: "CLOSE_MENU"
              })
            } else {
              dispatch({
                type: "OPEN_MENU",
                menu: "episodes"
              }) 
            }
          }} />
      </div>
    </div>
  );
};

export default Controls;