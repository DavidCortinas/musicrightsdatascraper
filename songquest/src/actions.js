export const SEARCH_SONG = 'SEARCH_SONG';
export const searchSong = (songData, query, dataLoaded) => {
  console.log(songData)
  console.log(query)
  return (
  {
    type: SEARCH_SONG,
    payload: { songData, query, dataLoaded },
});}

export const SEARCH_SONG_SUCCESS = 'SEARCH_SONG_SUCCESS';
export const searchSongSuccess = (songData, query, dataLoaded) => {
  console.log(songData)
  console.log(query)
  return ({
  type: SEARCH_SONG_SUCCESS,
  payload: { songData, query, dataLoaded }, // Include the query in the payload
});}
