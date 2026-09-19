import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TeacherDashboard() {
  const navigate = useNavigate()

  const [messages, setMessages] = useState([
    {
      id: 1,
      student: 'Ryder',
      message: 'I have a question.',
      acknowledged: false,
    },
    {
      id: 2,
      student: 'Sarah',
      message: 'Please repeat that.',
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

        <h2>Teacher Dashboard</h2>

        <p>Student Messages</p>

        <div className="teacher-messages">

          {messages.map((message) => (

            <div
              className="teacher-message-card"
              key={message.id}
            >

              <h3>{message.student}</h3>

              <p className="translated-message">
                "{message.message}"
              </p>

              {message.acknowledged ? (

                <p className="acknowledged">
                  ✓ Acknowledged
                </p>

              ) : (

                <button
                  className="acknowledge-button"
                  onClick={() =>
                    acknowledgeMessage(message.id)
                  }
                >
                  ✓ Acknowledge
                </button>

              )}

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}

export default TeacherDashboard
