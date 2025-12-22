import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { memo } from "react";

import { usePostProcessing } from "./usePostProcessing";

const Effects = memo(function Effects() {
  const postProcessing = usePostProcessing();

  return (
    postProcessing &&
    <EffectComposer>
      <Bloom />
    </EffectComposer>
  );
});

export default Effects;