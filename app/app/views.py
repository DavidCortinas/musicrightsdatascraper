import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from .scrapers import AscapScraper, BmiScraper


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


@csrf_exempt
def search_song(request):
    data = json.loads(request.body)
    song = data.get('song')
    performer = data.get('performer')

    ascap_data = AscapScraper.get_results(song, performer)
    bmi_data = BmiScraper.get_results(song, performer)

    response_data = {
        "ascap_results": ascap_data,
        "bmi_results": bmi_data
    }

    return JsonResponse(
        response_data,
        status=200,
        headers={'Access-Control-Allow-Origin': '*'}
    )
