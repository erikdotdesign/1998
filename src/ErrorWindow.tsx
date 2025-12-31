import WindowContainer from "./WindowContainer";
import useWindowManager from './WindowManager';
import ErrorIcon from "./assets/images/icons/error.png";

import "./ErrorWindow.css";

const ErrorWindow = ({
  id,
}: {
  id: string;
}) => {
  const { windows, dispatch } = useWindowManager();
  const win = windows[id];

  const handleCloseWindow = () => {
    dispatch({
      type: "CLOSE",
      id: win.id
    })
  };

  return (
    <WindowContainer 
      id={id}
      resizable={false}
      canMaximize={false}>
      <div className='c-error-window'>
        <div className='c-error-window__body'>
          <img src={ErrorIcon} />
          <p>{win.body}</p>
        </div>
        <div className="c-error-window__actions field-row">
          <button onClick={handleCloseWindow}>Okay</button>
          <button onClick={handleCloseWindow}>Cancel</button>
        </div>
      </div>
    </WindowContainer>
  );
};

export default ErrorWindow;
