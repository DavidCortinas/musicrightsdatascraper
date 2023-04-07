from ShazamAPI import Shazam
import requests
from yt_dlp import YoutubeDL
import os
from glob import glob


def generate_mp3_from_ytvid(yt_url):
    ydl_opts = {
        'format': 'mp3/bestaudio/best',
        # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
        'postprocessors': [{  # Extract audio using ffmpeg
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }],
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download(yt_url)


def get_track_from_yt():
    # doc = requests.get(
    #     'https://cs1.mp3.pm/download/69105706/dkFFRTVmVVNuRVNENi9kejlTWGQvYkJCUDYwMVJuY09VcE5FdmZ2Mm5DU2YzcFA4b3E4clZYTHhGSkxUeUd5c2RjQWs1U2hsWG5zT0YvRHZvRU5CYkYyTEpDMnErY29lcyt4Ym41TCtKWkJidERxRTVYWWFHb3VCSDdFR1ZTTGw/La_Bellini_-_Satan_In_Love_(mp3.pm).mp3')

    # with open('file-to-id.mp3', 'wb') as f:
    #     f.write(doc.content)

    # Above is for mp3 streaming/download url's below is for youtube url's
    # add condition to switch between options

    generate_mp3_from_ytvid('https://www.youtube.com/watch?v=VAI1aMEurSM')

    mp3 = glob('*.mp3')[0]

    mp3_file_content_to_recognize = open(mp3, 'rb').read()

    shazam = Shazam(mp3_file_content_to_recognize)
    recognize_generator = next(shazam.recognizeSong())

    return recognize_generator


def get_track_title():

    track_title = get_track_from_yt()[1]['track']['title'][:-6] if any(
        get_track_from_yt()[1]['track']['title'].endswith(x) for x in ('(live)', '(Live)')
    ) else get_track_from_yt()[1]['track']['title']

    if track_title.endswith('(Live)'):

        track_title.removesuffix('(Live)')

    mp3 = glob('*.mp3')[0]

    os.remove(mp3)

    return track_title


def get_track_artist():

    track_artist = get_track_from_yt()[1]['track']['subtitle']

    mp3 = glob('*.mp3')[0]

    os.remove(mp3)

    return track_artist
