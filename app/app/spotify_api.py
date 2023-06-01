import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

client_id = 'c1698c02315145779b659382642e0b4b'
client_secret = '1586875dc3fc43e98e315d8f5b240ddc'

client_credentials_manager = SpotifyClientCredentials(
    client_id=client_id, client_secret=client_secret)

sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)


def get_spotify_rights(song, performer):
    if performer:
        query = f'track:{song} artist:{performer}'
    else:
        query = song

    results = sp.search(q=query, type='track', limit=1)

    if len(results['tracks']['items'][0]['album']['id']) > 0:
        album_id = results['tracks']['items'][0]['album']['id']

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

    return data
