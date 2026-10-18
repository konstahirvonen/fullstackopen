import Blog from './Blog'
import { Link } from "react-router-dom"

const BlogForm = ({ blogs, setBlogs, user }) => {

  return (
    <div className='blog'>
      <h2>blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
        <ul key={blog.id}>
          <li>
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </li>
        </ul>
        )}
    </div>
  )
}

export default BlogForm