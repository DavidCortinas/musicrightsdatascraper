export const SEARCH_SONG = 'SEARCH_SONG';
export const searchSong = (songData, query, dataLoaded) => {
  return (
  {
    type: SEARCH_SONG,
    payload: { songData, query, dataLoaded },
});};

export const SEARCH_SONG_SUCCESS = 'SEARCH_SONG_SUCCESS';
export const searchSongSuccess = (songData, query, dataLoaded) => {
  return ({
  type: SEARCH_SONG_SUCCESS,
  payload: { songData, query, dataLoaded }, 
});};

export const SEARCH_SONG_FAILURE = 'SEARCH_SONG_FAILURE';
export const searchSongFailure = error => ({
  type: SEARCH_SONG_FAILURE,
  payload: error,
});

export const CLEAR_SEARCH_SONG_ERROR = 'CLEAR_SEARCH_SONG_ERROR';
export const clearSearchSongError = () => ({
  type: CLEAR_SEARCH_SONG_ERROR,
});

export const RESET_DATA_LOADED = 'RESET_DATA_LOADED';
export const resetDataLoaded = () => ({
  type: RESET_DATA_LOADED,
})
