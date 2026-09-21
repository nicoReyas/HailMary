"""Default gesture-to-message mappings used by the HailMary prototype."""

DEFAULT_GESTURE_MAPPINGS = {
    "Open_Palm": "I have a question.",
    "Thumb_Up": "I understand.",
    "Thumb_Down": "I do not understand.",
    "Closed_Fist": "I need help.",
    "Pointing_Up": "Please repeat that.",
    "Victory": "I need a break.",
}


def map_gesture(gesture_name: str, mappings: dict[str, str] | None = None) -> str:
    """Return the message assigned to a MediaPipe gesture name."""
    active_mappings = mappings or DEFAULT_GESTURE_MAPPINGS
    return active_mappings.get(gesture_name, "")
