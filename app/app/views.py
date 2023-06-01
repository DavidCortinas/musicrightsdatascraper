import json
import concurrent.futures
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from time import time
from . import spotify_api
from .scrapers import ascap_scraper, bmi_scraper


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


@csrf_exempt
def search_song(request):
    data = json.loads(request.body)
    song = data.get('song')
    performer = data.get('performer')

    start_time = time()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Submit the scraper functions to the executor
        ascap_executor = executor.submit(
            ascap_scraper.get_ascap_results, song, performer)
        bmi_executor = executor.submit(
            bmi_scraper.get_bmi_results, song, performer)
        spotify_executor = executor.submit(
            spotify_api.get_spotify_rights, song, performer)

        # Retrieve the results from the futures
        try:
            ascap_data = ascap_executor.result()
        except Exception as e:
            print('ASCAP Error: ', e)
            ascap_data = {}

        try:
            bmi_data = bmi_executor.result()
        except Exception as e:
            print('BMI Error: ', e)
            bmi_data = {}

        try:
            print("try spotify")
            spotify_data = spotify_executor.result()
        except Exception as e:
            print('Spotify Error: ', e)
            spotify_data = {}

    ascap_data.update(spotify_data) if ascap_data != {} else None

    bmi_data.update(spotify_data) if bmi_data != {} else None

    # combined_data = {}

    # # Merge the performers, writers, publishers, etc. as before
    # for key in ascap_data.keys():
    #     if key != 'title':
    #         combined_data[key] = list(
    #             set(ascap_data[key][0]).union(bmi_data[key][0]))

    # # Merge the titles separately
    # combined_data['title'] = list(
    #     set(ascap_data['title']).union(bmi_data['title']))

    # combined_data.update(spotify_data)

    # print('combined_data: ', combined_data)

    if ascap_data == {} and bmi_data == {}:
        raise ValueError('No search results')

    response_data = {
        "ascap_results": ascap_data,
        "bmi_results": bmi_data
    }

    end_time = time()

    elapsed_time = end_time - start_time

    print(f"Total elapsed run time: {elapsed_time} seconds")

    return JsonResponse(
        response_data,
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )
