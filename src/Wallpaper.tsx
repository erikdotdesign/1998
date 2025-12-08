import { useRef, useReducer, useEffect } from "react";
import { SynthwaveRunner } from "./runner";
import runnerReducer from "./runnerReducer";
import "./Wallpaper.css";

const Wallpaper = () => {
  const [runnerState, runnerDispatch] = useReducer(runnerReducer, {
    playing: true,
    zoom: 5,
    background: {
      visible: true,
      colors: ["#c4f1fd", "#ff00dd"]
    },
    fog: {
      color: "#ff00dd",
      density: 0.06
    },
    sun: {
      visible: true,
      colors: ["#fff", "#ff1ae0"]
    },
    plane: {
      color: "#4C0066",
      emissive: {
        color: "#999999"
      },
      displacement: {
        scale: 0
      },
      check: true
    },
    palms: {
      visible: true,
      color: "#000000",
      emissive: {
        color: "#000000"
      }
    },
    pillars: {
      visible: true,
      colors: ["#ff00ff", "#00ffff"]
    },
    hydrated: false
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SynthwaveRunner | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viewer = new SynthwaveRunner(canvasRef.current, { 
      width: 1200,
      height: 1200,
      onZoomChange: (zoom: number) => runnerDispatch({ type: "SET_ZOOM", zoom })
    });

    viewer.setScene(runnerState);
    viewer.startLoop();

    viewerRef.current = viewer;

    return () => {
      viewer.stopLoop(true);
    };
  }, []);

  return (
    <canvas className="c-wallpaper" ref={canvasRef} />
  );
};

export default Wallpaper;