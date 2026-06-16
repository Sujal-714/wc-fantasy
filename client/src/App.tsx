import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import TeamName from './pages/TeamName'
import BuildTeam from './pages/BuildTeam'
import PickPlayers from './pages/PickPlayers'
import Home from './pages/Home'
import Matches from './pages/Matches'
import Leaderboard from './pages/Leaderboard'
import Market from './pages/Market'
import SelectReplacement from './pages/SelectReplacement'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

import MatchPoints from './pages/MatchPoints'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
 <BrowserRouter>
  <div className="w-full max-w-[402px] mx-auto bg-white min-h-screen">
    <Routes>
      <Route path="/login"               element={<Login />} />
      <Route path="/register"            element={<Register />} />
      <Route path="/team-name"           element={<PrivateRoute><TeamName /></PrivateRoute>} />
      <Route path="/build"               element={<PrivateRoute><BuildTeam /></PrivateRoute>} />
      <Route path="/pick"                element={<PrivateRoute><PickPlayers /></PrivateRoute>} />
      <Route path="/"                    element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/matches"             element={<PrivateRoute><Matches /></PrivateRoute>} />
      <Route path="/leaderboard"         element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      <Route path="/market"              element={<PrivateRoute><Market /></PrivateRoute>} />
      <Route path="/profile"             element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/select-replacement"  element={<PrivateRoute><SelectReplacement /></PrivateRoute>} />
      <Route path="/points/:id"          element={<PrivateRoute><MatchPoints /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

      <Route path="*"                    element={<Navigate to="/login" />} />
    </Routes>
  </div>
</BrowserRouter>
  )
}