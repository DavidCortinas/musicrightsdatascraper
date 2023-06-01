import requests
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

client_id = 'c1698c02315145779b659382642e0b4b'
client_secret = '1586875dc3fc43e98e315d8f5b240ddc'

client_credentials_manager = SpotifyClientCredentials(
    client_id=client_id, client_secret=client_secret)

sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)


def get_spotify_rights(song, performer):

    song_query = song.replace("'", "%2527").replace(" ", "%2B")
    performer_query = performer.replace("'", "%2527").replace(" ", "%2520")
    # Replace with the actual URL
    url = f'https://api.spotify.com/v1/search?q={song_query}%2520artist%3A{performer_query}&type=track'

    headers = {
        'Authorization': 'Bearer BQDXg1pHYV8iL1EDLg_s6TVCa-idPMnv5_sON-EGaS-bAHjERJMg52xgvvQi-7xCcNfEwWY0cIm-nz9gVRPtybaqL7CBojAhaS6DuRzzto0xIAaqJSI'
    }

    # Send a GET request with the authorization header
    response = requests.get(url, headers=headers)

    # Check the response status code
    if response.status_code == 200:
        # Request was successful
        data = response.json()  # Assuming the response contains JSON data
        # Process the data as needed
        print(data)
    else:
        # Request was not successful
        print(f'Request failed with status code: {response.status_code}')

    if performer:
        query = f'track:{song} artist:{performer}'
    else:
        query = song

    print(query)

    results = sp.search(q=query, type='track', limit=1)
    print(results)

    if len(results['tracks']['items'][0]['album']['id']) > 0:
        album_id = results['tracks']['items'][0]['album']['id']

    album = sp.album(album_id=album_id)
    print(album)

    copyrights = album['copyrights']
    label = album['label']
    print(copyrights)
    print(label)

    copyrights_list = []
    for copyright in copyrights:
        copyrights_list.append(copyright['text'])

    data = {
        'copyrights': [copyrights_list],
        'label': [[label]]
    }
    print(data)

    return data
