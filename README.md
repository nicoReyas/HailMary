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
└── README.md
```

---

# Running the Project

HailMary uses **two terminals**:

1. One terminal for the Python/FastAPI backend
2. One terminal for the React/Vite frontend

You do **not** need a third terminal for the camera.

---

## First-Time Setup

You only need to do this section once after cloning the repository or after deleting your local dependency folders.

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd HailMary
```

---

## Backend Setup

### 2. Enter the Backend Folder

```bash
cd backend
```

### 3. Create the Python Virtual Environment

```bash
python3.14 -m venv .venv
```

The `.venv` folder is intentionally not stored in GitHub. Every developer creates their own local virtual environment.

### 4. Activate the Virtual Environment

```bash
source .venv/bin/activate
```

Your terminal should now begin with something similar to:

```text
(.venv) user@MacBook backend %
```

Verify the Python version:

```bash
python --version
```

Expected:

```text
Python 3.14.7
```

### 5. Install Backend Dependencies

```bash
python -m pip install -r requirements.txt
```

This command reads `requirements.txt` and installs the required Python libraries into `backend/.venv`.

You can confirm MediaPipe is using the expected version:

```bash
python -c "import mediapipe as mp; print(mp.__version__)"
```

Expected:

```text
0.10.35
```

---

## Frontend Setup

Open a second terminal.

### 6. Enter the Frontend Folder

From the HailMary project root:

```bash
cd frontend
```

If you are currently somewhere else:

```bash
cd ~/Desktop/HailMary/frontend
```

### 7. Install Frontend Dependencies

```bash
npm install
```

This creates `frontend/node_modules`.

Like `.venv`, `node_modules` is not stored in GitHub because it can be recreated from `package.json` and `package-lock.json`.

---

# Normal Startup

After the first-time setup is complete, you normally only need the commands below.

## Terminal 1 — Start the Backend

```bash
cd ~/Desktop/HailMary/backend
source .venv/bin/activate
python -m uvicorn app:app --reload
```

You should see something similar to:

```text
Uvicorn running on http://127.0.0.1:8000
Application startup complete.
```

To check that the backend is working, open:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

Leave this terminal running.

---

## Terminal 2 — Start the Frontend

```bash
cd ~/Desktop/HailMary/frontend
npm run dev
```

Vite should print a local address similar to:

```text
http://localhost:5173
```

Open that address in your browser.

Leave this terminal running too.

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

# Important: You Do Not Need to Run the Camera Script

Older versions of HailMary required this command:

```bash
python -m vision.camera
```

That is **not required for normal use anymore**.

The current flow is:

```text
Website webcam
    ->
FastAPI
    ->
MediaPipe
    ->
Website
```

`vision/camera.py` can still be kept as a standalone development/debugging tool, but the normal HailMary demo only requires the backend and frontend terminals.

---

# Stopping the Project

To stop either server, click its terminal and press:

```text
Control + C
```

You should stop both the FastAPI terminal and the Vite terminal when finished.

---

# Starting the Project Again Later

You do **not** need to recreate `.venv`, reinstall Python dependencies, or run `npm install` every time.

Normally:

### Terminal 1

```bash
cd ~/Desktop/HailMary/backend
source .venv/bin/activate
python -m uvicorn app:app --reload
```

### Terminal 2

```bash
cd ~/Desktop/HailMary/frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# When Do I Reinstall Dependencies?

## Python

Run:

```bash
python -m pip install -r requirements.txt
```

when:

- You cloned the repository for the first time
- You recreated `.venv`
- `requirements.txt` changed

You do **not** need to run it every time you start the project.

## Frontend

Run:

```bash
npm install
```

when:

- You cloned the repository for the first time
- You deleted `node_modules`
- `package.json` or `package-lock.json` changed

You do **not** need to run it every time you start the frontend.

---

# Common Problems

## `.venv/bin/activate: No such file or directory`

The virtual environment does not exist in that copy of the project.

Run:

```bash
cd ~/Desktop/HailMary/backend
python3.14 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

---

## `pip: command not found`

Use pip through Python:

```bash
python -m pip install -r requirements.txt
```

---

## Frontend Says a Package Is Missing

From the frontend folder:

```bash
npm install
```

Then restart:

```bash
npm run dev
```

---

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
