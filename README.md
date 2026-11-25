# HailMary

HailMary is an accessibility-focused classroom communication tool designed to help nonspeaking students communicate with teachers through personalized hand gestures.

A student uses their webcam in the HailMary Student Dashboard. The browser sends camera frames to the Python/FastAPI backend, MediaPipe recognizes supported hand gestures, and HailMary translates the detected gesture into a student-defined message. The student can then send that message to the Teacher Dashboard, where the teacher can acknowledge it.

HailMary was built as a prototype for SASEHack 2026.

---

## The Problem

Classroom communication is often designed around verbal interaction.

Some nonspeaking students may use gestures, AAC devices, sign language, or other alternative forms of communication. Individualized gestures may not always be immediately understood by every teacher or classroom staff member.

HailMary explores a simple question:

> What if a student could define what their gestures mean, and a computer could help communicate those messages to a teacher?

HailMary is not intended to replace AAC devices, sign language, or existing accessibility accommodations. It is a prototype exploring how computer vision could provide an additional personalized classroom communication tool.

---

## What HailMary Does

Students can:

- Open the Student Dashboard
- Enter their name
- Select **Begin Gesture Sharing**
- Preview their webcam directly in the website
- Make supported hand gestures
- See the detected gesture and recognition confidence
- Assign their own meanings to supported gestures
- Send the translated message to the teacher

Teachers can:

- Open the Teacher Dashboard
- See incoming student messages
- See which student sent each message
- See the gesture associated with the message
- Acknowledge messages

Example gesture mappings:

| Gesture | Example Student-Defined Meaning |
| --- | --- |
| Open Palm | I have a question. |
| Thumbs Up | I understand. |
| Closed Fist | I need help. |
| Pointing Up | Please repeat that. |

Different students can assign different meanings to the same supported gesture.

---

## How It Works

```text
Student Dashboard
       |
       | Begin Gesture Sharing
       v
Browser Webcam
       |
       | Camera frame
       v
FastAPI Backend
       |
       v
MediaPipe Gesture Recognition
       |
       v
Detected Gesture
       |
       v
Student Gesture Preference
       |
       v
Translated Message
       |
       | Send to Teacher
       v
Teacher Dashboard
       |
       v
Teacher Acknowledges Message
```

The browser handles the webcam preview. You do **not** need to run the old standalone `vision.camera` script for normal use.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Browser `getUserMedia()` webcam access

### Backend

- Python 3.14.7
- FastAPI
- Uvicorn

### Computer Vision

- OpenCV
- MediaPipe `0.10.35`
- MediaPipe Gesture Recognizer model

> MediaPipe `0.10.35` is intentionally used because newer MediaPipe versions caused a macOS crash during development.

---

## Project Structure

```text
HailMary/
|
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   │   └── gesture_recognizer.task
│   ├── vision/
│   │   ├── __init__.py
│   │   ├── camera.py
│   │   ├── gesture_mapper.py
│   │   └── gesture_recognizer.py
│   └── .venv/                  # Created locally; not pushed to GitHub
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── pages/
│   └── node_modules/           # Created locally; not pushed to GitHub
│
├── .gitignore
├── Makefile
└── README.md
```

---

# Running the Project

Install Make, Python 3.14, and Node.js (20.19+ in the 20.x series, or 22.12+) with npm. From the project root, run:

```bash
make setup
make dev
```

Open http://localhost:5173. Press **Ctrl+C** in the terminal to stop both development servers. Run `make dev` to start them again. Rerun `make setup` after changing dependency files or deleting a dependency directory.

| Command | What it does |
| --- | --- |
| `make help` | List available commands |
| `make backend` | Start FastAPI on http://127.0.0.1:8000 |
| `make frontend` | Start Vite on http://localhost:5173 by default |
| `make health` | Check the running backend for `{"status":"ok"}` |
| `make lint` | Lint the frontend |
| `make build` | Build the frontend into `frontend/dist/` |

---

# Using HailMary

## Student

1. Open the website.
2. Select the Student section.
3. Enter the student's name.
4. Select **Begin Gesture Sharing**.
5. Allow the browser to access the webcam if prompted.
6. The webcam preview should appear directly on the Student Dashboard.
7. Make a supported hand gesture.
8. HailMary sends camera frames to the backend for gesture recognition.
9. The detected gesture, confidence, and translated message appear on the page.
10. Select **Send to Teacher** to send the translated message.

You can change the meaning of supported gestures in **My Gesture Preferences** and save the new mappings.

---

## Teacher

1. Open the Teacher Dashboard.
2. Incoming student messages appear in the message feed.
3. Each message shows the student's name and translated message.
4. Select **Acknowledge** after responding to the student.

For a local demo, the Student Dashboard and Teacher Dashboard can be opened in separate browser tabs.

---

# Common Problems

## A Dependency Is Missing

Run `make setup` from the project root, then restart with `make dev`.

## Camera Does Not Open

Make sure:

- You selected **Begin Gesture Sharing**
- Your browser has camera permission
- Another program is not already using the camera
- The FastAPI backend is running
- You opened the site through the Vite localhost address

On macOS, camera permissions can be checked in:

```text
System Settings
-> Privacy & Security
-> Camera
```

---

## Backend Is Running but the Website Does Not Work

Make sure both servers are running at the same time:

```text
Backend:  http://127.0.0.1:8000
Frontend: http://localhost:5173
```

The frontend and backend are separate applications and both need to be running.

---

# Current Prototype Limitations

The current hackathon version is designed as an MVP.

- Messages and gesture preferences are currently stored in backend memory.
- Restarting the FastAPI backend can clear that temporary data.
- Gesture recognition is limited to the supported MediaPipe gesture classes.
- User-trained custom gestures are a future feature.
- The current prototype is designed primarily for a local hackathon demonstration.

---

# Future Ideas

Potential improvements include:

- Persistent database storage
- User accounts
- Per-student saved gesture profiles
- User-trained custom gestures
- Two-handed gestures
- Gesture sequences
- Confirmation gestures to reduce accidental messages
- Text-to-speech
- Mobile support
- Classroom management tools
- Integration with existing education platforms
- Additional accessibility customization

---

## Hackathon

Built for **SASEHack 2026**.
