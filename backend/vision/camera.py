import time

import cv2

from .gesture_recognizer import HandGestureRecognizer


def start_camera():

    camera = cv2.VideoCapture(0)

    if not camera.isOpened():
        print("Could not open webcam.")
        return

    recognizer = HandGestureRecognizer()

    print("HailMary started.")
    print("Press Q to quit.")

    while True:

        success, frame = camera.read()

        if not success:
            print("Could not read camera frame.")
            break

        # MediaPipe needs timestamps in milliseconds.
        timestamp_ms = int(
            time.monotonic() * 1000
        )

        gesture_name, confidence = recognizer.recognize(
            frame,
            timestamp_ms
        )

        display_text = (
            f"{gesture_name} "
            f"{confidence:.2f}"
        )

        # Put recognized gesture on webcam feed.
        cv2.putText(
            frame,
            display_text,
            (30, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 255, 255),
            2
        )

        cv2.imshow(
            "HailMary",
            frame
        )

        # Press Q to quit.
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    recognizer.close()

    camera.release()

    cv2.destroyAllWindows()


if __name__ == "__main__":
    start_camera()