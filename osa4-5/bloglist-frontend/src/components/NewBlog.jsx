import { useState } from 'react'

const NewBlogForm = ({
  createBlog
}) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [createBlogVisible, setCreateBlogVisible] = useState(false)
  const hideWhenVisible = { display: createBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: createBlogVisible ? '' : 'none' }

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

    setCreateBlogVisible(false)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setCreateBlogVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={addBlog}>
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