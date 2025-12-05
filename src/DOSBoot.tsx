import { useLayoutEffect, useState } from "react";

import "./DOSBoot.css";

const COMMANDS = [
  "Initializing system...", 
  "Loading user preferences...", 
  "Checking vibes...", 
  "Starting FakeOS 98..."
];

const DOSBoot = ({
  setPhase,
  duration = 4000
}: {
  setPhase: (phase: "DOS" | "OS") => void;
  duration?: number;
}) => {
  const [loadCommands, setLoadCommands] = useState(['']);

  useLayoutEffect(() => {
    const start = performance.now();

    const tick = () => {
      const now = performance.now();
      const progress = Math.min(((now - start) / duration) * 100, 100);

      // Determine how many commands to show based on progress
      const commandsToShow = Math.ceil((progress / 100) * COMMANDS.length);
      setLoadCommands(COMMANDS.slice(0, commandsToShow));

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setLoadCommands(COMMANDS);
        setPhase("OS");
      }
    };

    requestAnimationFrame(tick);
  }, [duration, setPhase]);

  return (
    <div className="c-dos-boot">
      <pre>
        {
          loadCommands.map((loadCommand, i) => (
            <div key={i}>{`C:\\> ${loadCommand}`}</div>
          ))
        }
      </pre>
    </div>
  );
};

export default DOSBoot;