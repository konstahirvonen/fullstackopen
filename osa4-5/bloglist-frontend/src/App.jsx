import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification, ErrorMessage } from './components/Notification'
import NewBlogForm from './components/NewBlog'
import LoginForm from './components/Loginform'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const createBlog = blogObject => {
    blogService
          .create(blogObject)
          .then(returnedBlog => {
            console.log('response')
            setBlogs(blogs.concat(returnedBlog))
            setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
  }

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
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  return (
    <div>
      <Notification message={message} />
      <ErrorMessage errorMessage={errorMessage} />

      {!user &&
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      }
      {user && (
        <>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <NewBlogForm createBlog={createBlog}
          />
          <BlogForm
            blogs={blogs}
            setBlogs={setBlogs}
            user={user}
          />
        </>
      )}

    </div>
  )
}

export default App