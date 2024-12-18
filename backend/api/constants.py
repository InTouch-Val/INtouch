import string

USER_TYPES = {
    0: "client",
    1: "doctor",
    2: "Anonymous",
}

ASSIGNMENT_TYPES = [
    ("lesson", "Lesson"),
    ("exercise", "Exercise"),
    ("essay", "Essay"),
    ("study", "Study"),
    ("quiz", "Quiz"),
    ("methodology", "Methodology"),
    ("metaphor", "Metaphor"),
    ("article", "Article"),
]

LANGUAGES = [
    ("fr", "French"),
    ("en", "English"),
    ("es", "Spanish"),
    ("de", "German"),
    ("it", "Italian"),
    ("ot", "Other"),
]

PRIMARY_EMOTIONS = [
    ("TERRIBLE", "Terrible"),
    ("BAD", "Bad"),
    ("OKAY", "Okay"),
    ("GOOD", "Good"),
    ("GREAT", "Great"),
]

CLARIFYING_EMOTIONS = [
    ("Loss", "Loss"),
    ("Fear", "Fear"),
    ("Guilt", "Guilt"),
    ("Laziness", "Laziness"),
    ("Interest", "Interest"),
    ("Pride", "Pride"),
    ("Hope", "Hope"),
    ("Happiness", "Happiness"),
    ("Anger", "Anger"),
    ("Anxiety", "Anxiety"),
    ("Embarrassment", "Embarrassment"),
    ("Calmness", "Calmness"),
    ("Inspiration", "Inspiration"),
    ("Humility", "Humility"),
    ("Nervousness", "Nervousness"),
    ("Depression", "Depression"),
    ("Shame", "Shame"),
    ("Amazement", "Amazement"),
    ("Euphoria", "Euphoria"),
    ("Disgust", "Disgust"),
    ("Sadness", "Sadness"),
    ("Joy", "Joy"),
    ("Respect", "Respect"),
    ("Exhaustion", "Exhaustion"),
    ("Impatience", "Impatience"),
    ("Excitement", "Excitement"),
    ("Loneliness", "Loneliness"),
    ("Frustration", "Frustration"),
    ("Acceptance", "Acceptance"),
    ("Enthusiasm", "Enthusiasm"),
    ("Love", "Love"),
    ("Disappointment", "Disappointment"),
    ("Confusion", "Confusion"),
    ("Satisfaction", "Satisfaction"),
    ("Self-love", "Self-love"),
    ("Gratitude", "Gratitude"),
]

BLOCK_TYPES = [
    ("image", "Image"),
    ("open", "Open"),
    ("single", "Single"),
    ("range", "Range"),
    ("multiple", "Multiple"),
    ("text", "Text"),
]

DIARY_FIELDS_TO_CHECK = [
    "event_details",
    "thoughts_analysis",
    "emotion_type",
    "physical_sensations",
]

# Random default value for username and password on profile's deleting.
RANDOM_VALUE_SIZE = 10
# Charset for username and password deleting.
RANDOM_CHARSET_FOR_DELETING = string.ascii_uppercase + string.digits
# Default field status after deleting.
FIELD_DELETED = "deleted"
TIME_DELETE_NON_ACTIVE_USER = 604800  # 7 days
DEFAULT_PAGE_SIZE = 10

METRICS_TABLE_ROWS = {
    "therapists": [
        "User ID",
        "Registration Date",
        "Rolling Retention 7D",
        "Rolling Retention 30D",
        "Last Seen",
        "Clients Invited",
        "Last Invited Client",
        "Last Sent Assignment",
        "Last Created Assignment",
        "Deleted On",
    ],
    "clients": [
        "User ID",
        "Registration Date",
        "Rolling Retention 7D",
        "Rolling Retention 30D",
        "Last Seen",
        "Last Done Assignment",
        "Last Diary Created",
        "Deleted On",
    ],
    "growth": [
        "Amount of registered therapists",
        "Amount of registered clients",
        "Amount of assignments",
        "Amount of deleted therapists",
        "Amount of deleted clients",
    ],
}
METRICS_FILES_NAMES = {
    "therapists": "therapists_metrics.csv",
    "clients": "clients_metrics.csv",
    "growth": "growth_metrics.csv",
}
METRICS_DATE_FORMAT = "%d %B %Y"

EMAIL_TEMPLATE = {
    USER_TYPES[0]: "registration/welcome_client.html",
    USER_TYPES[1]: "registration/welcome_doctor.html",
}
