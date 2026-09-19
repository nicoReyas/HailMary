import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

import './App.css'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        <Route
          path="/teacher"
          element={<TeacherDashboard />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App

