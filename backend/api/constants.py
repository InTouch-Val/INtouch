USER_TYPES = {
    0: "client",
    1: "doctor",
}

ASSIGNMENT_TYPES = [
    ("lesson", "Lesson"),
    ("exercise", "Exercise"),
    ("essay", "Essay"),
    ("study", "Study"),
    ("quiz", "Quiz"),
    ("methodology", "Methodology"),
    ("metaphors", "Metaphors"),
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
    ("Hapiness", "Hapiness"),
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
    ("Dissapointment", "Dissapointment"),
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

DELETING_FIELDS = {
    0: False,
    1: True,
    2: None,
    3: "deleted",
}

RANDOM_VALUE_SIZE = 10
# Random default value for username and password on profile's deleting.
TIME_DELETE_NON_ACTIVE_USER = 604800  # 7 days
DEFAULT_PAGE_SIZE = 10
METRICS_FILE_NAME = "project_metrics.csv"
