import {
  CLEAR_SEARCH_SONG_ERROR,
  RESET_DATA_LOADED,
  SEARCH_SONG,
  SEARCH_SONG_FAILURE,
  SEARCH_SONG_SUCCESS,
} from './actions';

const initialState = {
  query: { song: '', performer: '' },
  songData: { ascap_results: {}, bmi_results: {} },
  dataLoaded: false,
  error: null,
};

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
        query: payload.query,
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
      };
    case RESET_DATA_LOADED:
      return {
        ...state,
        dataLoaded: false,
      };
    default:
      return {
        ...state,
        dataLoaded: false,
      };
  }
};
