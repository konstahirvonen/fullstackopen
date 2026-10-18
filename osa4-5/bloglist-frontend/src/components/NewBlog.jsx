import { useState } from "react"
import blogService from '../services/blogs'
import { useNavigate } from "react-router-dom"
import { Button, TextField } from "@mui/material"

const NewBlogForm = ({ user, blogs, setBlogs, setMessage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const addBlog = (e) => {
    e.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })
 
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate("/")
  }

  const createBlog = blogObject => {
    blogService
          .create(blogObject)
          .then(returnedBlog => {
            console.log('response')
            setBlogs(blogs.concat(returnedBlog))
            setMessage({
              text: `Blog "${returnedBlog.title}" by "${returnedBlog.author}" added`,
              type: "success"
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
  }

  return (
    <div>

      <form onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          <TextField
            label="title"
            style={{ marginTop: 10 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            style={{ marginTop: 10 }}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            style={{ marginTop: 10 }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button type='submit' variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </div>
  )
}

export default NewBlogForm