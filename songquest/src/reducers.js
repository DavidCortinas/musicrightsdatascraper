import { SEARCH_SONG, SEARCH_SONG_SUCCESS } from "./actions";

export const song = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_SONG: {
      return {
        ...state,
        query: payload.query,
      };
    }
    case SEARCH_SONG_SUCCESS: {
      return {
        ...state,
        songData: payload.data,
        query: payload.query, // Update the query in the state
      };
    }
    default:
      return state;
  }
};
