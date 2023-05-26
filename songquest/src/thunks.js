import { searchSongSuccess, searchSong } from "./actions";
import SongForm from "./components/SongForm";
import getCSRFToken from "./csrf";

export const searchSongRequest = query => async dispatch => {
  try {
    const csrfToken = await getCSRFToken(); // Retrieve the CSRF token
    const body = JSON.stringify({
      song: query.song,
      performer: query.performer,
    });
    const response = await fetch('http://localhost:8000/search/', {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
      },
      method: 'post',
      credentials: 'include',
      body,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const songData = await response.json();
    console.log(songData)

    // Update the front end with the received data
    // Dispatch both searchSong and searchSongSuccess actions
    dispatch(searchSong(songData, query)); 
    console.log(songData)
    // Dispatch searchSong action
    dispatch(searchSongSuccess(songData, query)); // Dispatch searchSongSuccess action with the query
    console.log(songData)
    return songData
  } catch (error) {
    console.log('Error: ' + error.message);
    alert('We had trouble finding that song. Please make sure you are spelling the song correctly and enter the performer for the quickest and most accurate search result')
    dispatch(searchSongSuccess({ascap_results: {}, bmi_results: {}}, {song: '', performer: ''}))
  }
};



