import { CLEAR_SEARCH_SONG_ERROR, SEARCH_SONG, SEARCH_SONG_FAILURE, SEARCH_SONG_SUCCESS } from "./actions";

const initialState = {
  query: {song: '', performer: ''},
  songData: {ascap_results: {}, bmi_results: {}},
  dataLoaded: false,
  error: null,
}

export const song = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_SONG: {
      return {
        ...state,
        query: payload.query,
        dataLoaded: false,
      };
    }
    case SEARCH_SONG_SUCCESS: {
      return {
        ...state,
        songData: payload.songData,
        query: payload.query, // Update the query in the state
        dataLoaded: true,
      };
    }
    case SEARCH_SONG_FAILURE: {
      return {
        ...state,
        error: payload,
      };
    }
    case CLEAR_SEARCH_SONG_ERROR:
      return {
        ...state,
        error: null,
    }
    default: 
      return {
        ...state,
        dataLoaded: false,
      };
  }
};
