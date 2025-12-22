import "./ErrorOverlay.css";

const ErrorOverlay = ({
  error
}: {
  error: string | null
}) => {
  return (
    error && 
    <div className="c-error-overlay">
      <div className="c-error-overlay__dg" />
      <div className="c-error-overlay__header">Error</div>
      <div className="c-error-overlay__message">{error}</div>
    </div>
  );
};

export default ErrorOverlay;