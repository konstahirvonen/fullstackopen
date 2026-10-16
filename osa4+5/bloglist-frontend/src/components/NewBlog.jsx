import blogService from '../services/blogs'

const NewBlogForm = ({
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
  createBlogVisible,
  setCreateBlogVisible,
  setMessage,
  setBlogs,
  blogs
}) => {

  const hideWhenVisible = { display: createBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: createBlogVisible ? '' : 'none' }

  const createBlog = async (e) => {
    e.preventDefault()

    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log('response')
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    setCreateBlogVisible(false)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setCreateBlogVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={createBlog}>
          <h2>create new</h2>
          <div>
            <label>
                title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
                author
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
                url
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
          </div>
          <button type='submit'>create</button>
        </form>
        <button onClick={() => setCreateBlogVisible(false)}>cancel</button>
      </div>
    </div>
  )
}

export default NewBlogForm