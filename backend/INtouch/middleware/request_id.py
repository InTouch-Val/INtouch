import uuid


class RequestIDMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.META["ID"] = uuid.uuid4().__str__()
        return self.get_response(request)
