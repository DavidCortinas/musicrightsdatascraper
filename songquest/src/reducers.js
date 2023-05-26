import { SEARCH_SONG, SEARCH_SONG_SUCCESS } from "./actions";

const initialState = {
  query: {song: '', performer: ''},
  songData: {ascap_results: {}, bmi_results: {}}
}

export const song = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_SONG: {
      console.log(payload)
      return {
        ...state,
        query: payload.query,
      };
    }
    case SEARCH_SONG_SUCCESS: {
      console.log(payload)
      return {
        ...state,
        songData: payload.songData,
        query: payload.query, // Update the query in the state
      };
    }
    default:
      return state;
  }
};
