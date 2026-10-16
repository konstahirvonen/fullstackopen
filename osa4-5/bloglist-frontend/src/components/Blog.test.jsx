import {render, screen} from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"
import NewBlogForm from "./NewBlog"

test("renders title and author nothing else by default", () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "example.com",
        likes: 2,
        user: {
            username: "testuser",
            name: "testuser name"
        }
    }

    render(<Blog blog={blog} blogs={{blog}} setBlogs={() => {}} />)

    expect(screen.findByText("React patterns")).toBeDefined()
    expect(screen.findByText("Michael Chan")).toBeDefined()

    expect(screen.queryByText("example.com")).toBeNull()
    expect(screen.queryByText("5")).toBeNull()
    expect(screen.queryByText("testuser name")).toBeNull()
})

test("renders all info if show button is pressed", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "example.com",
        likes: 2,
        user: {
            username: "testuser",
            name: "testuser name"
        }
    }


    render(<Blog blog={blog} blogs={{blog}} setBlogs={() => {}} />)

    const user = userEvent.setup()
    const button = await screen.findByText("show")
    await user.click(button)

    expect(screen.findByText("React patterns")).toBeDefined()
    expect(screen.findByText("Michael Chan")).toBeDefined()
    expect(screen.queryByText("example.com")).toBeDefined()
    expect(screen.queryByText("5")).toBeDefined()
    expect(screen.queryByText("testuser name")).toBeDefined()
})

test("test like button pressed 2 times", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "example.com",
        likes: 2,
        user: {
            username: "testuser",
            name: "testuser name"
        }
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} blogs={[blog]} setBlogs={() => {}} updateLikes={mockHandler} />)

    const user = userEvent.setup()
    const showbutton = screen.getByText("show")
    await user.click(showbutton)

    mockHandler.mockResolvedValue({
        ...blog,
        id: '123',
        likes: 3
    })

    const likebutton = screen.getByText("like")
    await user.click(likebutton)
    await user.click(likebutton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test("test return correct response data after creating blog", async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<NewBlogForm 
        createBlog={createBlog}
        />)

    const createNewBlogButton = screen.getByText("create new blog")
    await user.click(createNewBlogButton)

    const titleInput = screen.getByLabelText("title")
    const authorInput = screen.getByLabelText("author")
    const urlInput = screen.getByLabelText("url")
    
    await user.type(titleInput, "Test title")
    await user.type(authorInput, "Test author")
    await user.type(urlInput, "Testurl.com")

    const createButton = screen.getByText("create")
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: "Test title",
        author: "Test author",
        url: "Testurl.com"
    })
})