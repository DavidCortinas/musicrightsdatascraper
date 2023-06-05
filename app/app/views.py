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
        # Initialize variables to hold the results
        ascap_data = {}
        bmi_data = {}
        spotify_data = {}

        try:
            # Submit the ASCAP scraper function to the executor
            ascap_future = executor.submit(
                ascap_scraper.get_ascap_results, song, performer)
        except Exception as e:
            print('ASCAP Error:', e)

        bmi_future = executor.submit(
            bmi_scraper.get_bmi_results, song, performer)
        spotify_future = executor.submit(
            spotify_api.get_spotify_rights, song, performer)

        # Wait for the futures to complete and retrieve the results
        futures = [ascap_future, bmi_future, spotify_future]
        for future in concurrent.futures.as_completed(futures):
            try:
                if future == ascap_future:
                    ascap_data = future.result()
                elif future == bmi_future:
                    bmi_data = future.result()
                elif future == spotify_future:
                    spotify_data = future.result()
            except Exception as e:
                print('Error:', e)

    ascap_data.update(spotify_data) if ascap_data else None
    bmi_data.update(spotify_data) if bmi_data else None

    if not ascap_data and not bmi_data:
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
