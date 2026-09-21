from datetime import datetime, timezone
from threading import Lock
import time

import cv2
import numpy as np

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from vision.gesture_mapper import DEFAULT_GESTURE_MAPPINGS, map_gesture
from vision.gesture_recognizer import HandGestureRecognizer


app = FastAPI(title="HailMary API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DetectionUpdate(BaseModel):
    gesture: str
    confidence: float = Field(ge=0.0, le=1.0)


class MessageCreate(BaseModel):
    student_name: str = Field(min_length=1, max_length=80)
    gesture: str
    message: str | None = None


class GestureMappingUpdate(BaseModel):
    message: str = Field(min_length=1, max_length=200)


state_lock = Lock()

# MediaPipe should only process one frame at a time.
vision_lock = Lock()

gesture_mappings = dict(DEFAULT_GESTURE_MAPPINGS)

latest_detection = {
    "gesture": "No Gesture",
    "confidence": 0.0,
    "message": "",
    "updated_at": None,
}

messages: list[dict] = []

next_message_id = 1


# Create the MediaPipe recognizer once when
# the backend starts.
vision_recognizer = HandGestureRecognizer()


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.get("/")
def root():
    return {
        "message": "HailMary backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/api/gestures")
def get_gesture_mappings():

    with state_lock:
        return dict(gesture_mappings)


@app.put("/api/gestures/{gesture_name}")
def update_gesture_mapping(
    gesture_name: str,
    update: GestureMappingUpdate
):

    with state_lock:

        gesture_mappings[gesture_name] = (
            update.message.strip()
        )

        return {
            "gesture": gesture_name,
            "message": gesture_mappings[gesture_name],
        }


@app.get("/api/detection")
def get_latest_detection():

    with state_lock:
        return dict(latest_detection)


@app.post("/api/detection")
def update_detection(
    detection: DetectionUpdate
):

    with state_lock:

        # Keep the last meaningful gesture visible
        # so the student has time to send it.
        if detection.gesture not in {
            "No Gesture",
            "None",
            "",
        }:

            translated_message = map_gesture(
                detection.gesture,
                gesture_mappings,
            )

            latest_detection.update(
                {
                    "gesture": detection.gesture,
                    "confidence": detection.confidence,
                    "message": translated_message,
                }
            )

        latest_detection["updated_at"] = (
            utc_now_iso()
        )

        return dict(latest_detection)


@app.post("/api/vision/frame")
async def process_vision_frame(
    request: Request
):

    """
    Receive a JPEG frame from the student's
    browser and run MediaPipe gesture recognition.
    """

    image_bytes = await request.body()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="No camera frame received.",
        )

    # Convert the raw JPEG bytes into
    # a NumPy array.
    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8,
    )

    # Decode the JPEG into an OpenCV image.
    frame = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR,
    )

    if frame is None:
        raise HTTPException(
            status_code=400,
            detail="Could not decode camera frame.",
        )

    # MediaPipe VIDEO mode requires
    # continuously increasing timestamps.
    timestamp_ms = int(
        time.monotonic() * 1000
    )

    # Prevent multiple browser requests from
    # using MediaPipe at the same time.
    with vision_lock:

        gesture_name, confidence = (
            vision_recognizer.recognize(
                frame,
                timestamp_ms,
            )
        )

    with state_lock:

        # Keep the most recent meaningful
        # gesture on screen.
        if gesture_name not in {
            "No Gesture",
            "None",
            "",
        }:

            translated_message = map_gesture(
                gesture_name,
                gesture_mappings,
            )

            latest_detection.update(
                {
                    "gesture": gesture_name,
                    "confidence": confidence,
                    "message": translated_message,
                }
            )

        latest_detection["updated_at"] = (
            utc_now_iso()
        )

        return dict(latest_detection)


@app.get("/api/messages")
def get_messages():

    with state_lock:

        # Newest messages appear first.
        return list(
            reversed(messages)
        )


@app.post(
    "/api/messages",
    status_code=201,
)
def create_message(
    message: MessageCreate
):

    global next_message_id

    translated_message = (
        message.message or ""
    ).strip()

    with state_lock:

        if not translated_message:

            translated_message = map_gesture(
                message.gesture,
                gesture_mappings,
            )

        if not translated_message:

            raise HTTPException(
                status_code=400,
                detail=(
                    "This gesture does not have "
                    "a message assigned to it."
                ),
            )

        new_message = {
            "id": next_message_id,
            "student": message.student_name.strip(),
            "gesture": message.gesture,
            "message": translated_message,
            "created_at": utc_now_iso(),
            "acknowledged": False,
        }

        next_message_id += 1

        messages.append(
            new_message
        )

        return new_message


@app.patch(
    "/api/messages/{message_id}/acknowledge"
)
def acknowledge_message(
    message_id: int
):

    with state_lock:

        for message in messages:

            if message["id"] == message_id:

                message["acknowledged"] = True

                return dict(
                    message
                )

    raise HTTPException(
        status_code=404,
        detail="Message not found",
    )


@app.delete("/api/messages")
def clear_messages():

    global next_message_id

    with state_lock:

        messages.clear()

        next_message_id = 1

    return {
        "status": "cleared"
    }