import base64
import requests
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from time import time

client_id = 'c1698c02315145779b659382642e0b4b'
client_secret = '1586875dc3fc43e98e315d8f5b240ddc'

client_credentials_manager = SpotifyClientCredentials(
    client_id=client_id, client_secret=client_secret)

sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

start_time = time()

def get_access_token():
    # Encode the client ID and client secret as base64
    encoded_credentials = base64.b64encode(
        f"{client_id}:{client_secret}".encode()).decode()

    # Set the headers and payload for the token request
    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }

    # Make the token request
    response = requests.post(
        "https://accounts.spotify.com/api/token", headers=headers, data=payload)

    if response.status_code == 200:
        # Parse the response to retrieve the access token and expiration time
        token_data = response.json()
        access_token = token_data["access_token"]
        expires_in = token_data["expires_in"]
        return access_token, expires_in
    else:
        # Handle the error response
        print(f"Error: {response.status_code} - {response.text}")
        return None, None

def get_spotify_rights(song, performer):
    start_time = time()
    try:
        try:
            if performer:
                query = f'track:{song} artist:{performer}'
            else:
                query = song

            results = sp.search(q=query, type='track', limit=1)

            if len(results['tracks']['items']) > 0:
                album_id = results['tracks']['items'][0]['album']['id']

        except Exception as e:
            print('Spotipy Album ID Error: ', e)

        try:

            # Get the initial access token
            access_token, expires_in = get_access_token()

            if access_token:
                # Use the access token in your API requests
                headers = {
                    "Authorization": f"Bearer {access_token}",
                }
                # Make your API request with the headers

                # Check if the access token has expired
                if expires_in <= 0:
                    # Access token has expired, get a new one
                    access_token, expires_in = get_access_token()
                    if access_token:
                        # Update the headers with the new access token
                        headers["Authorization"] = f"Bearer {access_token}"
                        # Make your API request with the updated headers
            else:
                # Handle the error case
                print("Failed to obtain access token.")
                
            song_query = song.replace("'", "%2527").replace(" ", "%2B")
            performer_query = performer.replace("'", "%2527").replace(" ", "%2520")

            url = f'https://api.spotify.com/v1/search?q={song_query}%2520artist%3A{performer_query}&type=track'

            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                tracks = data['tracks']['items']

                target_track = None
                for track in tracks:
                    if (
                        track['name'].lower() == song.lower() and track['artists'][0]['name'].lower() == performer.lower()
                    ):
                        target_track = track
                        break

                if target_track:
                    album_id = target_track['album']['id']
                else:
                    print('Track not found')

            else:
                print(f'Request failed with status code: {response.status_code}')
        except Exception as e:
            print('Spotify API Album ID Error: ', e)

    except Exception as e:
        print('Spotify Get Album ID Error: ', e)

    album = sp.album(album_id=album_id)

    copyrights = album['copyrights']
    label = album['label']

    copyrights_list = []
    for copyright in copyrights:
        copyrights_list.append(copyright['text'])

    data = {
        'copyrights': [copyrights_list],
        'label': [[label]]
    }

    end_time = time()

    elapsed_time = end_time - start_time

    print(f"Spotify elapsed run time: {elapsed_time} seconds")

    return data
