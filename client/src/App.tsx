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
import Points from './pages/Points'
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
          <Route path="/login"    element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/team-name" element={<PrivateRoute><TeamName /></PrivateRoute>} />
           <Route path="/pick"     element={<PrivateRoute><PickPlayers /></PrivateRoute>} />
            <Route path="/"         element={<PrivateRoute><Home /></PrivateRoute>} /> 
            <Route path="/matches" element={<Matches />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/build"    element={<PrivateRoute><BuildTeam /></PrivateRoute>} />
          <Route path="/market" element={<Market />} />
          <Route path="/profile" element={<Profile />} />
<Route path="/select-replacement" element={<SelectReplacement />} />
<Route path="/match-points" element={<MatchPoints />} />
    <Route path="/points" element={<Points />} />
          <Route path="*"         element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}