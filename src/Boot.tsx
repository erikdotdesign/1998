import { useState } from "react";

import DOSBoot from "./DosBoot";
import OSBoot from "./OSBoot";

const Boot = ({
  setBooted,
  DOSDuration = 4000,
  OSDuration = 3000
}: {
  setBooted: (booted: boolean) => void;
  DOSDuration?: number;
  OSDuration?: number;
}) => {
  const [phase, setPhase] = useState<"DOS" | "OS">("DOS");

  switch(phase) {
    case "DOS":
      return <DOSBoot duration={DOSDuration} setPhase={setPhase} />;
    case "OS":
      return <OSBoot duration={OSDuration} setBooted={setBooted} />;
  }
};

export default Boot;