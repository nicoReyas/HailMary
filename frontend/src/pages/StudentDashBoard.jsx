import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'


const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000'


const TEST_GESTURES = [
  ['Open_Palm', 'Open Palm'],
  ['Thumb_Up', 'Thumbs Up'],
  ['Closed_Fist', 'Closed Fist'],
  ['Pointing_Up', 'Point Up'],
]


function StudentDashboard() {

  const navigate = useNavigate()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const streamRef = useRef(null)

  const frameTimerRef = useRef(null)

  const sendingFrameRef = useRef(false)


  const [studentName, setStudentName] =
    useState('Student')

  const [detection, setDetection] =
    useState({
      gesture: 'No Gesture',
      confidence: 0,
      message: '',
      updated_at: null,
    })

  const [draftMappings, setDraftMappings] =
    useState({})

  const [status, setStatus] =
    useState('')

  const [backendOnline, setBackendOnline] =
    useState(false)

  const [sharing, setSharing] =
    useState(false)

  const [
    savingPreferences,
    setSavingPreferences,
  ] = useState(false)


  async function loadMappings() {

    try {

      const response = await fetch(
        `${API_URL}/api/gestures`
      )

      if (!response.ok) {
        throw new Error(
          'Could not load gesture mappings'
        )
      }

      const data =
        await response.json()

      setDraftMappings(data)

      setBackendOnline(true)

    } catch {

      setBackendOnline(false)
    }
  }


  async function loadDetection() {

    try {

      const response = await fetch(
        `${API_URL}/api/detection`
      )

      if (!response.ok) {

        throw new Error(
          'Could not load detection'
        )
      }

      const data =
        await response.json()

      setDetection(data)

      setBackendOnline(true)

    } catch {

      setBackendOnline(false)
    }
  }


  useEffect(() => {

    loadMappings()
    loadDetection()

    const timer =
      setInterval(
        loadDetection,
        500
      )

    return () => {

      clearInterval(timer)

      if (frameTimerRef.current) {

        clearInterval(
          frameTimerRef.current
        )
      }

      if (streamRef.current) {

        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          )
      }
    }

  }, [])


  async function sendCameraFrame() {

    if (sendingFrameRef.current) {
      return
    }

    const video =
      videoRef.current

    const canvas =
      canvasRef.current


    if (
      !video ||
      !canvas ||
      video.readyState < 2 ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      return
    }


    sendingFrameRef.current = true


    try {

      // Smaller frames make MediaPipe
      // faster while remaining clear enough
      // for gesture recognition.
      const targetWidth = 640

      const scale =
        targetWidth /
        video.videoWidth

      canvas.width =
        targetWidth

      canvas.height =
        Math.round(
          video.videoHeight *
          scale
        )


      const context =
        canvas.getContext('2d')


      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      )


      canvas.toBlob(

        async (blob) => {

          if (!blob) {

            sendingFrameRef.current =
              false

            return
          }


          try {

            const response =
              await fetch(
                `${API_URL}/api/vision/frame`,
                {
                  method: 'POST',

                  headers: {
                    'Content-Type':
                      'image/jpeg',
                  },

                  body: blob,
                }
              )


            if (!response.ok) {

              throw new Error(
                'Vision request failed'
              )
            }


            const data =
              await response.json()


            setDetection(data)

            setBackendOnline(true)

          } catch {

            setBackendOnline(false)

          } finally {

            sendingFrameRef.current =
              false
          }

        },

        'image/jpeg',

        0.7
      )

    } catch {

      sendingFrameRef.current =
        false
    }
  }


  async function beginGestureSharing() {

    setStatus('')


    try {

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {

        throw new Error(
          'Camera access is not supported by this browser.'
        )
      }


      const stream =
        await navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: false,
          })


      streamRef.current =
        stream


      if (videoRef.current) {

        videoRef.current.srcObject =
          stream

        await videoRef.current.play()
      }


      setSharing(true)

      setStatus(
        'Gesture sharing started.'
      )


      frameTimerRef.current =
        setInterval(
          sendCameraFrame,
          350
        )

    } catch (error) {

      setSharing(false)

      setStatus(
        `Could not start camera: ${error.message}`
      )
    }
  }


  function stopGestureSharing() {

    if (frameTimerRef.current) {

      clearInterval(
        frameTimerRef.current
      )

      frameTimerRef.current =
        null
    }


    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(
          (track) =>
            track.stop()
        )

      streamRef.current =
        null
    }


    if (videoRef.current) {

      videoRef.current.srcObject =
        null
    }


    setSharing(false)

    setStatus(
      'Gesture sharing stopped.'
    )
  }


  async function sendMessage() {

    if (!detection.message) {

      setStatus(
        'Make a recognized gesture first.'
      )

      return
    }


    try {

      const response =
        await fetch(
          `${API_URL}/api/messages`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              student_name:
                studentName.trim() ||
                'Student',

              gesture:
                detection.gesture,

              message:
                detection.message,
            }),
          }
        )


      if (!response.ok) {

        const error =
          await response.json()

        throw new Error(
          error.detail ||
          'Could not send message'
        )
      }


      setStatus(
        'Message sent to your teacher.'
      )

    } catch (error) {

      setStatus(
        `Could not send message: ${error.message}`
      )
    }
  }


  async function simulateGesture(
    gesture
  ) {

    try {

      const response =
        await fetch(
          `${API_URL}/api/detection`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                gesture,
                confidence: 1,
              }),
          }
        )


      if (!response.ok) {

        throw new Error(
          'Could not simulate gesture'
        )
      }


      const data =
        await response.json()


      setDetection(data)

      setStatus('')

      setBackendOnline(true)

    } catch {

      setStatus(
        'Start the backend before using test gestures.'
      )

      setBackendOnline(false)
    }
  }


  async function savePreferences() {

    setSavingPreferences(true)

    setStatus('')


    try {

      const entries =
        Object.entries(
          draftMappings
        )


      await Promise.all(

        entries.map(
          async (
            [gesture, message]
          ) => {

            const response =
              await fetch(
                `${API_URL}/api/gestures/${gesture}`,
                {
                  method: 'PUT',

                  headers: {
                    'Content-Type':
                      'application/json',
                  },

                  body:
                    JSON.stringify({
                      message:
                        message.trim(),
                    }),
                }
              )


            if (!response.ok) {

              throw new Error(
                `Could not save ${gesture}`
              )
            }
          }
        )
      )


      setStatus(
        'Gesture preferences saved.'
      )


      await loadDetection()

    } catch (error) {

      setStatus(
        `Could not save preferences: ${error.message}`
      )

    } finally {

      setSavingPreferences(false)
    }
  }


  return (

    <div className="page">

      <header className="header">

        <div>

          <h1>
            HailMary
          </h1>

          <p>
            Your gestures. Your voice.
          </p>

        </div>


        <button
          className="back-button"
          onClick={() =>
            navigate('/')
          }
        >
          Home
        </button>

      </header>


      <main className="dashboard">

        <div className="dashboard-title">

          <h2>
            Student Dashboard
          </h2>

          <p>
            Use a personalized gesture
            to communicate with your
            teacher.
          </p>

        </div>


        <section className="profile-card">

          <label htmlFor="student-name">
            Your name
          </label>

          <input
            id="student-name"

            value={studentName}

            onChange={(event) =>
              setStudentName(
                event.target.value
              )
            }

            placeholder="Student name"
          />

        </section>


        <section className="camera-card">

          <div className="camera-card-header">

            <div>

              <h3>
                Gesture Camera
              </h3>

              <p>
                Start sharing to use
                your webcam for gesture
                recognition.
              </p>

            </div>


            <span
              className={
                sharing &&
                backendOnline

                  ? 'camera-status'

                  : 'camera-status camera-offline'
              }
            >

              {sharing &&
              backendOnline

                ? 'Sharing Active'

                : sharing

                  ? 'Connecting'

                  : 'Not Sharing'}

            </span>

          </div>


          <div className="camera-preview-wrapper">

            <video
              ref={videoRef}

              className={
                sharing
                  ? 'camera-preview'
                  : 'camera-preview camera-preview-hidden'
              }

              autoPlay
              muted
              playsInline
            />


            {!sharing && (

              <div className="camera-placeholder">

                <div>

                  <h4>
                    Camera preview
                  </h4>

                  <p>
                    Your webcam preview
                    will appear here after
                    you begin gesture
                    sharing.
                  </p>

                </div>

              </div>
            )}

          </div>


          <canvas
            ref={canvasRef}

            style={{
              display: 'none',
            }}
          />


          <div className="camera-controls">

            {!sharing ? (

              <button
                className="send-button"

                onClick={
                  beginGestureSharing
                }
              >
                Begin Gesture Sharing
              </button>

            ) : (

              <button
                className="secondary-button"

                onClick={
                  stopGestureSharing
                }
              >
                Stop Gesture Sharing
              </button>

            )}

          </div>

        </section>


        <section className="gesture-result-card">

          <div className="result-box">

            <span className="result-label">
              Detected Gesture
            </span>

            <strong>

              {detection.gesture ||
                'Waiting for gesture...'}

            </strong>


            {detection.gesture !==
              'No Gesture' && (

              <span className="confidence-text">

                Confidence:{' '}

                {Math.round(
                  (
                    detection.confidence ||
                    0
                  ) * 100
                )}

                %

              </span>
            )}

          </div>


          <div className="result-box">

            <span className="result-label">
              Translated Message
            </span>

            <strong>

              {detection.message ||
                'Your message will appear here.'}

            </strong>

          </div>


          <button
            className="send-button"

            onClick={
              sendMessage
            }

            disabled={
              !detection.message ||
              !backendOnline
            }
          >
            Send to Teacher
          </button>


          {status && (

            <p className="status-message">
              {status}
            </p>

          )}

        </section>


        <section className="preferences-card">

          <div className="section-heading">

            <div>

              <h3>
                My Gesture Preferences
              </h3>

              <p>
                Choose what each supported
                gesture means for you.
              </p>

            </div>

          </div>


          <div className="preference-grid">

            {Object.entries(
              draftMappings
            ).map(
              (
                [gesture, message]
              ) => (

                <label
                  className="preference-row"
                  key={gesture}
                >

                  <span>

                    {gesture.replaceAll(
                      '_',
                      ' '
                    )}

                  </span>


                  <input
                    value={message}

                    onChange={(event) =>
                      setDraftMappings(
                        (current) => ({
                          ...current,

                          [gesture]:
                            event.target.value,
                        })
                      )
                    }
                  />

                </label>
              )
            )}

          </div>


          <button
            className="secondary-button"

            onClick={
              savePreferences
            }

            disabled={
              savingPreferences ||
              Object.keys(
                draftMappings
              ).length === 0
            }
          >

            {savingPreferences
              ? 'Saving...'
              : 'Save Preferences'}

          </button>

        </section>


        <section className="test-section">

          <h3>
            Demo / Camera Fallback
          </h3>

          <p>
            Use these buttons to test
            HailMary without a webcam.
          </p>


          <div className="gesture-buttons">

            {TEST_GESTURES.map(
              (
                [gesture, label]
              ) => (

                <button
                  key={gesture}

                  onClick={() =>
                    simulateGesture(
                      gesture
                    )
                  }
                >

                  {label}

                </button>
              )
            )}

          </div>

        </section>

      </main>

    </div>
  )
}


export default StudentDashboard