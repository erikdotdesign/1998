import useWindowManager from './WindowManager';
import ErrorWindow from "./ErrorWindow";

const Errors = () => {
  const { windows } = useWindowManager();

  return (
    <>
      {Object.values(windows).filter(w => w.windowType === "error").map(p => (
        <ErrorWindow
          key={p.id}
          id={p.id}
        />
      ))}
    </>
  );
};

export default Errors;