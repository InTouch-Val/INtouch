import os
import logging

from django.conf import settings
from dotenv import load_dotenv


load_dotenv()


class CustomFormatter(logging.Formatter):
    """Colored output formatter for logger."""

    grey = "\x1b[38;21m"
    blue = "\x1b[38;5;39m"
    yellow = "\x1b[38;5;226m"
    red = "\x1b[38;5;196m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"

    def __init__(self, fmt):
        super().__init__()
        self.fmt = fmt
        self.FORMATS = {
            logging.DEBUG: self.grey + self.fmt + self.reset,
            logging.INFO: self.blue + self.fmt + self.reset,
            logging.WARNING: self.yellow + self.fmt + self.reset,
            logging.ERROR: self.red + self.fmt + self.reset,
            logging.CRITICAL: self.bold_red + self.fmt + self.reset,
        }

    def format(self, record):
        formatter = logging.Formatter(self.FORMATS.get(record.levelno))
        return formatter.format(record)


logs_path = settings.BASE_DIR / ".data/logs/"
logs_filename = logs_path / "requests.log"

logger_formatter = CustomFormatter(fmt="[%(asctime)s] [%(levelname)s] - %(message)s")
logger_handler = logging.handlers.TimedRotatingFileHandler(
    logs_filename, when="h", interval=1, backupCount=5, encoding="utf-8", utc=True
)
logger_handler.setFormatter(logger_formatter)
logger = logging.getLogger(__name__)
logger.setLevel(os.getenv("REQUESTS_LOGGING_LEVEL", logging.INFO))
logger.addHandler(logger_handler)
