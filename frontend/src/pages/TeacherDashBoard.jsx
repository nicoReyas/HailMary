import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function formatTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function TeacherDashboard() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [backendOnline, setBackendOnline] = useState(false)

  async function loadMessages() {
    try {
      const response = await fetch(`${API_URL}/api/messages`)
      if (!response.ok) throw new Error('Could not load messages')
      setMessages(await response.json())
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    }
  }

  useEffect(() => {
    loadMessages()
    const timer = setInterval(loadMessages, 800)
    return () => clearInterval(timer)
  }, [])

  async function acknowledgeMessage(id) {
    try {
      const response = await fetch(`${API_URL}/api/messages/${id}/acknowledge`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Could not acknowledge message')
      await loadMessages()
    } catch {
      setBackendOnline(false)
    }
  }

  const waitingMessages = messages.filter((message) => !message.acknowledged).length

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>HailMary</h1>
          <p>Classroom communication dashboard</p>
        </div>

        <button className="back-button" onClick={() => navigate('/')}>
          Home
        </button>
      </header>

      <main className="dashboard">
        <div className="dashboard-title">
          <h2>Teacher Dashboard</h2>
          <p>View and acknowledge student messages in real time.</p>
        </div>

        <section className="teacher-summary">
          <div className="summary-card">
            <span className="summary-label">Total Messages</span>
            <strong>{messages.length}</strong>
          </div>

          <div className="summary-card">
            <span className="summary-label">Waiting</span>
            <strong>{waitingMessages}</strong>
          </div>
        </section>

        <section className="message-feed">
          <div className="message-feed-header">
            <div>
              <h3>Student Messages</h3>
              <p>New classroom messages appear here automatically.</p>
            </div>

            <span className={backendOnline ? 'live-status' : 'live-status offline-status'}>
              {backendOnline ? '● Live' : '● Offline'}
            </span>
          </div>

          <div className="teacher-messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <div>💬</div>
                <h3>No messages yet</h3>
                <p>Student messages will appear here when they are sent.</p>
              </div>
            )}

            {messages.map((message) => (
              <article className="teacher-message-card" key={message.id}>
                <div className="message-card-top">
                  <div>
                    <h3>{message.student}</h3>
                    <span className="message-time">{formatTime(message.created_at)}</span>
                  </div>

                  {message.acknowledged ? (
                    <span className="acknowledged-badge">✓ Acknowledged</span>
                  ) : (
                    <span className="waiting-badge">Waiting</span>
                  )}
                </div>

                <div className="teacher-message-content">
                  <span className="result-label">Message</span>
                  <p className="translated-message">{message.message}</p>
                  <span className="gesture-detail">
                    Gesture: {message.gesture.replaceAll('_', ' ')}
                  </span>
                </div>

                {!message.acknowledged && (
                  <button
                    className="acknowledge-button"
                    onClick={() => acknowledgeMessage(message.id)}
                  >
                    ✓ Acknowledge
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default TeacherDashboard
