import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {

  const navigate = useNavigate()

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function validation(values) {
    let errors = {}

    if (!values.email) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email inválido"
    }

    if (!values.password) {
      errors.password = "Senha é obrigatória"
    } else if (values.password.length < 6) {
      errors.password = "Mínimo 6 caracteres"
    }

    return errors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validation(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {

      axios.post('http://localhost:8081/login', {
        email: values.email,
        senha: values.password
      })
      .then(res => {

        localStorage.setItem("token", res.data.token)

        setMessage(res.data.message)
        setErrorMessage("")

        navigate('/dashboard')

      })
      .catch(err => {
        setErrorMessage(err.response?.data?.error || "Erro no login")
        setMessage("")
      })
    }
  }

  function handleInput(event) {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div 
      className='d-flex justify-content-center align-items-center vh-100'
      style={{ background: "linear-gradient(135deg, #000000, #1a1a1a)" }}
    >
      <form 
        onSubmit={handleSubmit}
        className="p-4 w-25"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white"
        }}
      >
        
        <h3 className="text-center mb-4">Login</h3>

        {message && (
          <div className="mb-3 text-center">
            <small style={{color: "lightgreen"}}>{message}</small>
          </div>
        )}

        {errorMessage && (
          <div className="mb-3 text-center">
            <small style={{color: "red"}}>{errorMessage}</small>
          </div>
        )}

        <div className='mb-3'>
          <label>Email</label>
          <input 
            type='email'
            name='email'
            className='form-control'
            onChange={handleInput}
          />
          {errors.email && 
            <small style={{ color: "red" }}>{errors.email}</small>
          }
        </div>

        <div className='mb-3'>
          <label>Senha</label>

          <div style={{ position: "relative" }}>
            <input 
              type={showPassword ? "text" : "password"}
              name='password'
              className='form-control'
              onChange={handleInput}
              style={{ paddingRight: "45px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.85}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                opacity: 0.85,
                display: "flex",
                alignItems: "center"
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 24 24">
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                  <circle cx="12" cy="12" r="2.5"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 24 24">
                  <path d="M2 5l17 17M10.58 10.58A2 2 0 0 0 13.42 13.42M9.88 5.09A11.77 11.77 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-5.17 5.87M6.1 6.1A21.85 21.85 0 0 0 1 12s4 7 11 7a11.68 11.68 0 0 0 5.23-1.17"/>
                </svg>
              )}
            </span>
          </div>

          {errors.password && 
            <small style={{ color: "red" }}>{errors.password}</small>
          }
        </div>

        <button className='btn btn-success w-100 mb-3'>
          Entrar
        </button>
        
        <p className='text-center'>Não tem conta?</p>
        
        <Link 
          to='/novo_login'
          className='btn btn-outline-light w-100 text-decoration-none'
        >
          Criar conta
        </Link>

      </form>
    </div>
  )
}

export default Login