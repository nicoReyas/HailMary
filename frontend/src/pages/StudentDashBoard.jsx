import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentDashboard() {
  const navigate = useNavigate()

  const [detectedGesture, setDetectedGesture] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const gestures = {
    OPEN_PALM: 'I have a question.',
    THUMBS_UP: 'I understand.',
    CLOSED_FIST: 'I need help.',
    POINT_UP: 'Please repeat that.',
  }

  function detectGesture(gesture) {
    setDetectedGesture(gesture)
    setMessage(gestures[gesture])
    setStatus('')
  }

  function sendMessage() {
    if (!message) {
      setStatus('Please select a gesture first.')
      return
    }

    setStatus('Message sent to your teacher.')
  }

  return (
    <div className="page">

      <header className="header">
        <h1>HailMary</h1>

        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </header>

      <main className="dashboard">

        <h2>Student Dashboard</h2>

        <p>Welcome, Ryder</p>

        <section className="camera-section">

          <h3>Gesture Camera</h3>

          <div className="camera-placeholder">
            Camera will appear here
          </div>

        </section>

        <section>

          <h3>Test Gestures</h3>

          <p>
            These buttons temporarily simulate what the camera
            will eventually recognize.
          </p>

          <div className="gesture-buttons">

            <button onClick={() => detectGesture('OPEN_PALM')}>
              ✋ Open Palm
            </button>

            <button onClick={() => detectGesture('THUMBS_UP')}>
              👍 Thumbs Up
            </button>

            <button onClick={() => detectGesture('CLOSED_FIST')}>
              ✊ Closed Fist
            </button>

            <button onClick={() => detectGesture('POINT_UP')}>
              ☝️ Point Up
            </button>

          </div>

        </section>

        {detectedGesture && (
          <section className="message-card">

            <p>
              <strong>Detected gesture:</strong>
              {' '}
              {detectedGesture}
            </p>

            <h3>Your message</h3>

            <p className="translated-message">
              "{message}"
            </p>

            <button
              className="send-button"
              onClick={sendMessage}
            >
              Send to Teacher
            </button>

          </section>
        )}

        {status && (
          <p className="status-message">
            {status}
          </p>
        )}

      </main>

    </div>
  )
}

export default StudentDashboard
