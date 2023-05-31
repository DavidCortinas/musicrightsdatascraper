import json
import concurrent.futures
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from time import time
from .scrapers import AscapScraper, BmiScraper


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
        future1 = executor.submit(
            AscapScraper.get_ascap_results, song, performer)
        future2 = executor.submit(BmiScraper.get_bmi_results, song, performer)

        # Retrieve the results from the futures
        try:
            ascap_data = future1.result()
        except Exception as e:
            ascap_data = {}

        try:
            bmi_data = future2.result()
        except Exception as e:
            bmi_data = {}

    if ascap_data == {} and bmi_data == {}:
        raise ValueError('No search results')

    response_data = {
        "ascap_results": ascap_data,
        "bmi_results": bmi_data
    }

    end_time = time()

    elapsed_time = end_time - start_time
    print(ascap_data)
    print(bmi_data)

    print(f"Elapsed run time: {elapsed_time} seconds")

    return JsonResponse(
        response_data,
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )
