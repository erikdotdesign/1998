import LoadingIcon from "./assets/images/cursors/wait.svg";

import "./LoadingModal.css";

const LoadingModal = () => {
  return (
    <div className="c-loading-modal">
      <img src={LoadingIcon} />
    </div>
  );
};

export default LoadingModal;
