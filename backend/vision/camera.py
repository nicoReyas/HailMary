import json
import os
import time
import urllib.error
import urllib.request

import cv2

from .gesture_recognizer import HandGestureRecognizer


API_URL = os.getenv("HAILMARY_API_URL", "http://127.0.0.1:8000")
POST_INTERVAL_SECONDS = 0.35


def send_detection(gesture_name: str, confidence: float) -> bool:
    """Send the latest computer-vision result to the FastAPI backend."""
    payload = json.dumps(
        {
            "gesture": gesture_name,
            "confidence": float(confidence),
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"{API_URL}/api/detection",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=0.4):
            return True
    except (urllib.error.URLError, TimeoutError):
        return False


def start_camera():
    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("Could not open webcam.")
        return

    recognizer = HandGestureRecognizer()
    last_post_time = 0.0
    backend_connected = False

    print("HailMary started.")
    print("Press Q to quit.")
    print(f"Sending detections to {API_URL}")

    try:
        while True:
            success, frame = camera.read()

            if not success:
                print("Could not read camera frame.")
                break

            timestamp_ms = int(time.monotonic() * 1000)
            gesture_name, confidence = recognizer.recognize(
                frame,
                timestamp_ms,
            )

            display_text = f"{gesture_name} {confidence:.2f}"

            cv2.putText(
                frame,
                display_text,
                (30, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2,
            )

            now = time.monotonic()
            if now - last_post_time >= POST_INTERVAL_SECONDS:
                backend_connected = send_detection(gesture_name, confidence)
                last_post_time = now

            connection_text = (
                "Backend: connected" if backend_connected else "Backend: not connected"
            )
            cv2.putText(
                frame,
                connection_text,
                (30, 85),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2,
            )

            cv2.imshow("HailMary", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        recognizer.close()
        camera.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    start_camera()
