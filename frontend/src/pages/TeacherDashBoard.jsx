import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TeacherDashboard() {
  const navigate = useNavigate()

  // Temporary messages for frontend testing.
  // Later these will come from the database in real time.
  const [messages, setMessages] = useState([
    {
      id: 1,
      student: 'Ryder',
      message: 'I have a question.',
      gesture: 'OPEN_PALM',
      time: '10:42 AM',
      acknowledged: false,
    },
    {
      id: 2,
      student: 'Sarah',
      message: 'Please repeat that.',
      gesture: 'POINT_UP',
      time: '10:39 AM',
      acknowledged: true,
    },
  ])

  function acknowledgeMessage(id) {
    setMessages(
      messages.map((message) =>
        message.id === id
          ? { ...message, acknowledged: true }
          : message
      )
    )
  }

  const waitingMessages = messages.filter(
    (message) => !message.acknowledged
  ).length

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

        <div className="dashboard-title">
          <h2>Teacher Dashboard</h2>

          <p>
            View and acknowledge student messages in real time.
          </p>
        </div>

        <section className="teacher-summary">

          <div className="summary-card">
            <span className="summary-label">
              Total Messages
            </span>

            <strong>{messages.length}</strong>
          </div>

          <div className="summary-card">
            <span className="summary-label">
              Waiting
            </span>

            <strong>{waitingMessages}</strong>
          </div>

        </section>

        <section className="message-feed">

          <div className="message-feed-header">

            <div>
              <h3>Student Messages</h3>

              <p>
                New classroom messages will appear here.
              </p>
            </div>

            <span className="live-status">
              ● Live
            </span>

          </div>

          <div className="teacher-messages">

            {messages.map((message) => (

              <article
                className="teacher-message-card"
                key={message.id}
              >

                <div className="message-card-top">

                  <div>
                    <h3>{message.student}</h3>

                    <span className="message-time">
                      {message.time}
                    </span>
                  </div>

                  {message.acknowledged ? (
                    <span className="acknowledged-badge">
                      ✓ Acknowledged
                    </span>
                  ) : (
                    <span className="waiting-badge">
                      Waiting
                    </span>
                  )}

                </div>

                <div className="teacher-message-content">

                  <span className="result-label">
                    Message
                  </span>

                  <p className="translated-message">
                    {message.message}
                  </p>

                  <span className="gesture-detail">
                    Gesture: {message.gesture}
                  </span>

                </div>

                {!message.acknowledged && (

                  <button
                    className="acknowledge-button"
                    onClick={() =>
                      acknowledgeMessage(message.id)
                    }
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
