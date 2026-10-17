import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, user, updateLikes = blogService.updateLikes }) => {

  const [showBlogInfo, setShowBlogInfo] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async (e) => {
    e.preventDefault()

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
    }
  }

  return (
    <div style={blogStyle}>
      <div data-testid="blog">
        {blog.title} {blog.author}
        <button onClick={() => setShowBlogInfo(!showBlogInfo)}>
          {showBlogInfo ? 'hide' : 'show'}
        </button>
        {showBlogInfo && (
          <div>
            <p>{blog.title} {blog.author}</p>
            <p>{blog.url}</p>
            <p>{blog.likes} <button onClick={handleLike}>like</button> </p>
            <p>{blog.user ? blog.user.name : ''}</p>
            {user && blog.user && user.username === blog.user.username &&
              <button onClick={removeBlog}>delete</button>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog