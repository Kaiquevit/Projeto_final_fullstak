import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {

  const [data, setData] = useState("")
  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (!token) {
      navigate('/') // 🔒 bloqueia acesso
      return
    }

    axios.get('http://localhost:8081/dashboard', {
      headers: {
        Authorization: token
      }
    })
    .then(res => {
      setData(res.data.message)
    })
    .catch(err => {
      console.log(err)
      navigate('/') // 🔒 token inválido
    })

  }, [])

  return (
    <div style={{color: "white", textAlign: "center", marginTop: "100px"}}>
      <h1>{data}</h1>
      <h2>Bem-vindo ao sistema 🔐</h2>
    </div>
  )
}

export default Dashboard