import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentDashboard() {
  const navigate = useNavigate()

  const [detectedGesture, setDetectedGesture] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  // Temporary gesture mappings.
  // Later these can come from the database.
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

    // Later this will send the message to the database/backend.
    setStatus('Message sent to your teacher.')
  }

  return (
    <div className="page">

      {/* Header */}
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

        {/* Dashboard title */}
        <div className="dashboard-title">
          <h2>Student Dashboard</h2>

          <p>
            Communicate with your teacher using your personalized gestures.
          </p>
        </div>

        {/* Camera */}
        <section className="camera-card">

          <div className="camera-card-header">

            <div>
              <h3>Gesture Camera</h3>

              <p>
                Position your hand clearly in front of the camera.
              </p>
            </div>

            <span className="camera-status">
              Camera Ready
            </span>

          </div>

          <div className="camera-placeholder">

            <div>
              <div className="camera-icon">
                📷
              </div>

              <p>
                Camera preview will appear here
              </p>
            </div>

          </div>

        </section>

        {/* Gesture results */}
        <section className="gesture-result-card">

          <div className="result-box">

            <span className="result-label">
              Detected Gesture
            </span>

            <strong>
              {detectedGesture || 'Waiting for gesture...'}
            </strong>

          </div>

          <div className="result-box">

            <span className="result-label">
              Translated Message
            </span>

            <strong>
              {message || 'Your message will appear here.'}
            </strong>

          </div>

          <button
            className="send-button"
            onClick={sendMessage}
            disabled={!message}
          >
            Send to Teacher
          </button>

          {status && (
            <p className="status-message">
              {status}
            </p>
          )}

        </section>

        {/* Temporary gesture testing */}
        <section className="test-section">

          <h3>Test Gestures</h3>

          <p>
            Use these buttons to simulate gesture recognition
            until the camera system is connected.
          </p>

          <div className="gesture-buttons">

            <button
              onClick={() => detectGesture('OPEN_PALM')}
            >
              <span>✋</span>
              Open Palm
            </button>

            <button
              onClick={() => detectGesture('THUMBS_UP')}
            >
              <span>👍</span>
              Thumbs Up
            </button>

            <button
              onClick={() => detectGesture('CLOSED_FIST')}
            >
              <span>✊</span>
              Closed Fist
            </button>

            <button
              onClick={() => detectGesture('POINT_UP')}
            >
              <span>☝️</span>
              Point Up
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default StudentDashboard
