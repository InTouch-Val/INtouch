"""
Middleware to log `*/api/*` requests and responses.
"""

import socket
import json

from INtouch.logger import logger


class RequestLogMiddleware:
    """Request Logging Middleware."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        log_data = {
            "request_id": request.META["ID"],
            "response_status": None,
            "remote_address": request.META["REMOTE_ADDR"],
            "server_hostname": socket.gethostname(),
            "request_method": request.method,
            "request_path": request.get_full_path(),
        }

        # Only logging "*/api/*" patterns
        if "/api/" in str(request.path):
            try:
                request_body = (
                    json.loads(request.body.decode("utf-8")) if request.body else {}
                )
                log_data["request_body"] = request_body
            except json.decoder.JSONDecodeError as e:
                logger.exception(f"Incorrect JSON was given: {e} ")

        # Getting response
        response = self.get_response(request)
        log_data["response_status"] = response.status_code

        # Getting response body
        try:
            response_body = json.loads(response.content.decode("utf-8"))
            log_data["response_body"] = response_body
        except json.decoder.JSONDecodeError:
            log_data["response_body"] = {}

        logger.info(msg=log_data)
        return response

    # Log unhandled exceptions as well
    def process_exception(self, request, exception):
        try:
            raise exception
        except Exception as e:
            logger.exception("Unhandled Exception: " + str(e))
        return exception
