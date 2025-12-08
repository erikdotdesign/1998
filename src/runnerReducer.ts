
export type RunnerState = {
  playing: boolean;
  zoom: number;
  background: {
    visible: boolean;
    colors: string[];
  };
  fog: {
    color: string;
    density: number;
  };
  sun: {
    visible: boolean;
    colors: string[];
  };
  plane: {
    color: string;
    emissive: {
      color: string;
    },
    displacement: {
      scale: number;
    },
    check: boolean;
  };
  palms: {
    visible: boolean;
    color: string;
    emissive: {
      color: string;
    }
  };
  pillars: {
    visible: boolean;
    colors: string[];
  };
  hydrated: boolean;
};

export type RunnerAction = 
  | { type: "HYDRATE_STATE"; state: RunnerState } 
  | { type: "SET_PLAYING", playing: boolean } 
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_BACKGROUND_VISIBLE"; visible: boolean }
  | { type: "SET_BACKGROUND_COLORS"; colors: string[] }
  | { type: "SET_FOG_COLOR"; color: string }
  | { type: "SET_FOG_DENSITY"; density: number }
  | { type: "SET_SUN_VISIBLE"; visible: boolean }
  | { type: "SET_SUN_COLORS"; colors: string[] }
  | { type: "SET_PLANE_COLOR"; color: string }
  | { type: "SET_PLANE_EMISSIVE_COLOR"; color: string }
  | { type: "SET_PLANE_DISPLACEMENT_SCALE"; scale: number }
  | { type: "SET_PLANE_CHECK"; check: boolean }
  | { type: "SET_PALMS_VISIBLE"; visible: boolean }
  | { type: "SET_PALMS_COLOR"; color: string }
  | { type: "SET_PALMS_EMISSIVE_COLOR"; color: string }
  | { type: "SET_PILLARS_VISIBLE"; visible: boolean }
  | { type: "SET_PILLARS_COLORS"; colors: string[] }

const runnerReducer = (state: RunnerState, action: RunnerAction): RunnerState => {
  switch (action.type) {
    case "HYDRATE_STATE": return { ...state, ...action.state, hydrated: true };
    case "SET_PLAYING": return { ...state, playing: action.playing };
    case "SET_ZOOM": return { ...state, zoom: action.zoom };
    case "SET_BACKGROUND_VISIBLE": return { 
      ...state, 
      background: { ...state.background, visible: action.visible } 
    };
    case "SET_BACKGROUND_COLORS": return { 
      ...state, 
      background: { ...state.background, colors: action.colors } 
    };
    case "SET_FOG_COLOR": return { 
      ...state, 
      fog: { ...state.fog, color: action.color } 
    };
    case "SET_FOG_DENSITY": return { 
      ...state, 
      fog: { ...state.fog, density: action.density } 
    };
    case "SET_SUN_VISIBLE": return { 
      ...state, 
      sun: { ...state.sun, visible: action.visible } 
    };
    case "SET_SUN_COLORS": return { 
      ...state, 
      sun: { ...state.sun, colors: action.colors } 
    };
    case "SET_PLANE_COLOR": return { 
      ...state, 
      plane: { ...state.plane, color: action.color } 
    };
    case "SET_PLANE_EMISSIVE_COLOR": return { 
      ...state, 
      plane: { 
        ...state.plane, 
        emissive: { ...state.plane.emissive, color: action.color } 
      } 
    };
    case "SET_PLANE_DISPLACEMENT_SCALE": return { 
      ...state, 
      plane: { 
        ...state.plane, 
        displacement: {
          ...state.plane.displacement,
          scale: action.scale
        }
      } 
    };
    case "SET_PLANE_CHECK": return { 
      ...state, 
      plane: { ...state.plane, check: action.check } 
    };
    case "SET_PALMS_VISIBLE": return { 
      ...state, 
      palms: { ...state.palms, visible: action.visible } 
    };
    case "SET_PALMS_COLOR": return { 
      ...state, 
      palms: { ...state.palms, color: action.color } 
    };
    case "SET_PALMS_EMISSIVE_COLOR": return { 
      ...state, 
      palms: { 
        ...state.palms, 
        emissive: {
          ...state.palms.emissive,
          color: action.color
        }
      } 
    };
    case "SET_PILLARS_VISIBLE": return { 
      ...state, 
      pillars: { ...state.pillars, visible: action.visible } 
    };
    case "SET_PILLARS_COLORS": return { 
      ...state, 
      pillars: { ...state.pillars, colors: action.colors } 
    };
    default: return state;
  }
};

export default runnerReducer;