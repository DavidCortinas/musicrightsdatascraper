export const SEARCH_SONG = 'SEARCH_SONG';
export const searchSong = (songData, query) => {
  console.log(songData)
  console.log(query)
  return (
  {
    type: SEARCH_SONG,
    payload: { songData, query },
});}

export const SEARCH_SONG_SUCCESS = 'SEARCH_SONG_SUCCESS';
export const searchSongSuccess = (songData, query) => {
  console.log(songData)
  console.log(query)
  return ({
  type: SEARCH_SONG_SUCCESS,
  payload: { songData, query }, // Include the query in the payload
});}