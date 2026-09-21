# HailMary

HailMary is an accessibility-focused classroom communication tool designed to help nonspeaking students communicate with teachers through personalized hand gestures.

Using a webcam and computer vision, HailMary recognizes a student's hand gesture, translates it into a message based on that student's individual preferences, and sends the message to the teacher in real time.

## The Problem

Classroom communication is often designed around verbal interaction.

Some nonspeaking students may use gestures, communication devices, or other forms of alternative communication to express their needs. However, individualized gestures may not always be immediately understood by every teacher or classroom staff member.

HailMary explores a simple question:

> What if a student could teach the computer what their gestures mean, and the computer could communicate those messages to the teacher?

## Our Solution

HailMary allows each student to create a personalized set of gesture-to-message mappings.

For example:

| Gesture | Student-Defined Meaning |
| --- | --- |
| Open palm | "I have a question." |
| Thumbs up | "I understand." |
| Closed fist | "I need help." |
| Pointing up | "Please repeat that." |

The student's webcam detects the gesture and the system translates it into the corresponding message.

The teacher then receives a notification showing:

- Which student sent the message
- What the gesture means
- When the message was sent

The teacher can acknowledge the message so the student knows that they were heard.

## How It Works

```text
Student
   |
   v
Webcam
   |
   v
Hand Gesture Detection
   |
   v
Student's Personal Gesture Preferences
   |
   v
Gesture Converted to Message
   |
   v
Message Sent to Server
   |
   v
Teacher Dashboard
   |
   v
Teacher Acknowledges Message


Personalization

HailMary is not designed around one universal gesture vocabulary.

Instead, each student can assign their own meaning to supported gestures.

For example:
Student A
Open Palm -> "I have a question."

Student B
Open Palm -> "Please slow down."

This allows the system to adapt to the student rather than requiring the student to adapt to the system.

Planned MVP Features
Student and teacher accounts
Student-specific gesture preferences
Real-time webcam hand detection
Gesture recognition
Gesture-to-message translation
Teacher notification dashboard
Student name attached to each message
Teacher acknowledgement system
Planned Tech Stack
Computer Vision
Python
OpenCV
MediaPipe
Frontend
React
Vite
Backend
FastAPI
Database / Realtime Communication
Supabase
Privacy

A major design goal of HailMary is minimizing unnecessary video transmission.

Ideally, webcam processing will occur locally on the student's device. Only the interpreted message would be sent to the teacher rather than the student's raw video feed.

Hackathon Scope

HailMary is being developed as a prototype for SASEHack 2026.

The goal of the prototype is to demonstrate the complete communication flow:
Student makes gesture
        ->
Computer recognizes gesture
        ->
Gesture is translated using student's preferences
        ->
Teacher receives message
        ->
Teacher acknowledges message

The project is not intended to replace AAC devices, sign language, or existing accessibility accommodations. Instead, HailMary explores how computer vision could provide an additional personalized communication tool in classroom environments.

Future Ideas

Potential features beyond the hackathon prototype include:

User-trained custom gestures
Two-handed gesture recognition
More advanced gesture sequences
Text-to-speech output
Mobile support
Classroom management tools
Gesture confirmation to reduce false detections
Accessibility customization
Integration with existing classroom platforms

Project HailMary

Built for SASEHack 2026.



## MVP Quick Start

The current hackathon prototype has three running pieces:

1. FastAPI backend (`backend/app.py`)
2. Python/OpenCV/MediaPipe camera process (`backend/vision/camera.py`)
3. React/Vite frontend (`frontend/`)

### 1. Start the backend

```bash
cd backend
source .venv/bin/activate
python -m uvicorn app:app --reload
```

The API runs at `http://127.0.0.1:8000`.

### 2. Start gesture recognition

Open a second terminal:

```bash
cd backend
source .venv/bin/activate
python -m vision.camera
```

The camera window recognizes a supported MediaPipe gesture and sends only the recognized gesture + confidence to the backend. Press `Q` in the camera window to stop it.

### 3. Start the frontend

Open a third terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite address (normally `http://localhost:5173`). Use `/student` for the student dashboard and `/teacher` for the teacher dashboard.

### Demo flow

1. Open the Student Dashboard.
2. Make a supported hand gesture in the Python camera window.
3. The detected gesture and translated message appear on the Student Dashboard.
4. Click **Send to Teacher**.
5. Open the Teacher Dashboard and see the message appear automatically.
6. Click **Acknowledge**.
7. The message changes to acknowledged.

The student can also edit what each supported gesture means under **My Gesture Preferences**.

### Two-laptop demo

Run the backend and camera on the student's Mac with:

```bash
python -m uvicorn app:app --reload --host 0.0.0.0
```

On the teacher/frontend Mac, create `frontend/.env` and point it at the backend Mac's local network IP:

```env
VITE_API_URL=http://BACKEND_MAC_IP:8000
```

Then restart `npm run dev`.

### Prototype limitation

Messages and gesture preferences are currently stored in memory for the hackathon MVP. Restarting the FastAPI server clears them. Persistent student accounts and database-backed preferences are a planned next step.
