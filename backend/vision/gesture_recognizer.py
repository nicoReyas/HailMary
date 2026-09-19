from pathlib import Path

import cv2
import mediapipe as mp


class HandGestureRecognizer:

    def __init__(self):

        # Find our model regardless of where Python was launched from.
        backend_folder = Path(__file__).resolve().parents[1]

        model_path = (
            backend_folder
            / "models"
            / "gesture_recognizer.task"
        )

        # Configure MediaPipe.
        options = mp.tasks.vision.GestureRecognizerOptions(
            base_options=mp.tasks.BaseOptions(
                model_asset_path=str(model_path)
            ),

            # We are processing webcam video frame-by-frame.
            running_mode=mp.tasks.vision.RunningMode.VIDEO,

            num_hands=1,

            min_hand_detection_confidence=0.5,
            min_hand_presence_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        self.recognizer = (
            mp.tasks.vision.GestureRecognizer
            .create_from_options(options)
        )

    def recognize(self, frame, timestamp_ms):

        # OpenCV stores images as BGR.
        # MediaPipe expects RGB.
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        # Convert the OpenCV frame into
        # a MediaPipe image.
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_frame
        )

        result = self.recognizer.recognize_for_video(
            mp_image,
            timestamp_ms
        )

        # No hand / gesture detected.
        if not result.gestures:
            return "No Gesture", 0.0

        # Get highest-ranked gesture.
        gesture = result.gestures[0][0]

        return (
            gesture.category_name,
            gesture.score
        )

    def close(self):
        self.recognizer.close()