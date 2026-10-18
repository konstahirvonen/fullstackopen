import { useState } from 'react'
import blogService from '../services/blogs'
import { Link, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, Typography, Button, Box } from '@mui/material'

const Blog = ({ blog, setBlogs, blogs, user, updateLikes = blogService.updateLikes }) => {
  const id = useParams().id
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const handleLike = async (e) => {
    e.preventDefault()

    if (!user) {
      return null
    }

    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    const returnedBlog = await updateLikes(blog.id, blogObject)

    setBlogs(blogs.map(b =>
      b.id === returnedBlog.id ? returnedBlog : b
    ))
  }

  const removeBlog = async () => {

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.removeBlog(blog.id)

      setBlogs(blogs =>
        blogs.filter(b => b.id !== blog.id)
      )
      navigate("/")
    }
  }

  return (
    <div data-testid="blog">
      <Card sx={{mb: 2, maxWidth: 600}}>
        <CardContent>

          <Typography variant="h6">{blog.title}</Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>by {blog.author}</Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            <Link href={blog.url}>
              {blog.url}
            </Link>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography>
              Likes: {blog.likes}
            </Typography>

            {user && (
              <Button variant="outlined" size="small" onClick={handleLike}>
                Like
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Added by: {blog.user ? blog.user.name : ''}
          </Typography>

          {user && blog.user && user.username === blog.user.username && (
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={removeBlog}
              sx={{ mt: 2 }}
            >
              Delete
            </Button>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default Blog