import { useEffect, useRef, useCallback } from "react";
import "js-dos";
import { type DosFactory, type DosRuntime } from "js-dos";
import { DosCommandInterface } from "js-dos/dist/typescript/js-dos-ci";
import { type Action } from "./reducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Dos = (window as any).Dos as DosFactory;

export type DoomRef = {
  ciRef: React.RefObject<DosCommandInterface | null>;
  runtimeRef: React.RefObject<DosRuntime | null>;
  sendCheat: (cheat: string) => void;
  restart: () => Promise<void>;
};

const useDoom = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  dispatch: (action: Action) => void
): DoomRef => {
  const ciRef = useRef<DosCommandInterface | null>(null);
  const runtimeRef = useRef<DosRuntime | null>(null);

  const simulateKey = (code: number) => {
    const ci = ciRef.current;
    if (!ci) return;
    ci.simulateKeyEvent(code, true);
    ci.simulateKeyEvent(code, false);
  };

  const sendCheat = (cheat: string) => {
    cheat.split('').forEach((ch) => simulateKey(ch.toUpperCase().charCodeAt(0)));
  };

  const startGame = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      dispatch({ type: "START_LOADING" });

      const runtime = await Dos(canvasRef.current, {
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
        onprogress: (stage, total, loaded) => {
          let displayStage;
          if (stage.includes("Resolving DosBox")) displayStage = "engine";
          else displayStage = "game";
          dispatch({
            type: "SET_LOAD_PROGRESS",
            loadProgress: {
              stage: displayStage,
              loaded: Number((loaded * 100 / total).toFixed(0))
            }
          });
        },
      });

      runtimeRef.current = runtime;

      const testUrl = "https://js-dos.com/cdn/upload/DOOM-@evilution.zip";

      const res = await fetch(testUrl, { method: "HEAD" });
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("DOOM archive not found (404)");
        } else {
          throw new Error(`Unexpected status: ${res.status}`);
        }
      }

      await runtime.fs.extract(testUrl);
      const ci = await runtime.main(["-c", "cd DOOM", "-c", "DOOM.EXE"]);
      ciRef.current = ci;

      // Small delay to hide game dos boot
      const BOOT_HIDE_DELAY = 1200;
      await new Promise(r => setTimeout(r, BOOT_HIDE_DELAY));
      canvasRef.current.focus();
      simulateKey(27);

      dispatch({ type: "SET_READY" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch({ 
        type: "SET_ERROR", 
        error: (err instanceof Error ? err.message : String(err ?? "Failed to initialize DOOM")),
      });
    }
  }, [canvasRef]);

  const restart = useCallback(async () => {
    // Kill the old runtime
    if (ciRef.current) {
      try {
        ciRef.current.exit();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) { /* empty */ }
      ciRef.current = null;
    }

    // Small delay to ensure cleanup completes
    await new Promise((r) => setTimeout(r, 200));

    // Restart fresh
    await startGame();
  }, [startGame]);

  useEffect(() => {
    startGame();
    return () => {
      ciRef.current?.exit();
    };
  }, [startGame]);

  return { ciRef, runtimeRef, sendCheat, restart };
};

export default useDoom;