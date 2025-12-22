import { useEffect } from "react";
import { mergeState } from "./reducerUtils";
import { State, Action, Collection } from "./reducer";

const STORAGE_KEY = "pokemon-sv-151-cache";

const useLocalStorage = (
  state: State,
  dispatch: (action: Action) => void
) => {
  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Ensure collection exists
        const collection: Collection = parsed.collection ?? { cards: {} };

        dispatch({
          type: "HYDRATE_STATE",
          state: mergeState(state, { collection }),
        });
      }
    } catch (e) {
      console.error("Failed to parse localStorage cache", e);
    }
  }, []);

  // Save whenever collection changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ collection: state.collection })
      );
    } catch (e) {
      console.error("Failed to save localStorage cache", e);
    }
  }, [state.collection.cards]);
};

export default useLocalStorage;