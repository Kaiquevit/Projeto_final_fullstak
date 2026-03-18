import './App.css'
import Login from './Login'
import Novo_login from './Novo_login'
import Dashboard from './Dashboard' // 🔥 NOVO

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/novo_login" element={<Novo_login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* 🔥 NOVO */}
      </Routes>
    </BrowserRouter>
  )
}

export default App