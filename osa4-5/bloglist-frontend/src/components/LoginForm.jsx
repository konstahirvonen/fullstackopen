import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Notification } from '../components/Notification'
import { TextField, Button } from "@mui/material"

const LoginForm = ({user, setUser}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
      }
    }, [])

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      navigate("/")
    } catch {
      setMessage({
        type: "error",
        text: "wrong credentials"
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={message} />

      <form onSubmit={handleLogin}>
        <h2>Login to application</h2>
        <div>
          <TextField
            label="username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
      </form>
    </div>
  )
}

export default LoginForm