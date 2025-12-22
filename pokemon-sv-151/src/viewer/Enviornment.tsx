import { usePostProcessing } from "./usePostProcessing";

const Enviornment = () => {
  const postProcessing = usePostProcessing();
  return (
    <>
      <color attach="background" args={[postProcessing ? "#DCE4F9" : '#DCE4F9']} />
      <fog attach="fog" args={[postProcessing ? "#DCE4F9" : '#DCE4F9', 0, 25]} />
    </>
  );
};

export default Enviornment;