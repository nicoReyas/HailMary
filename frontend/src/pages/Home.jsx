import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <header className="header">
        <h1>HailMary</h1>
        <p>Your gestures. Your voice.</p>
      </header>

      <main className="home">
        <h2>Welcome to HailMary</h2>

        <p className="description">
          Personalized classroom communication designed to help
          nonspeaking students communicate with teachers using gestures.
        </p>

        <h3>How are you using HailMary?</h3>

        <div className="role-buttons">
          <button
            className="role-button"
            onClick={() => navigate('/student')}
          >
            Student
          </button>

          <button
            className="role-button"
            onClick={() => navigate('/teacher')}
          >
            Teacher
          </button>
        </div>
      </main>
    </div>
  )
}

export default Home
