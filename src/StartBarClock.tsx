import { useEffect, useState } from "react";

const StartBarClock = () => {
  const [time, setTime] = useState<string>("");

  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad minutes and seconds with leading zeros if less than 10
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    setTime(`${hours}:${formattedMinutes} ${ampm}`);
  };
  
  useEffect(() => {
    setInterval(updateClock, 1000);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar-field">
        <span className="c-start-bar__time">{time}</span>
      </div>
    </div>
  );
};

export default StartBarClock;