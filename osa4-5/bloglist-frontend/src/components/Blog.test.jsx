import {render, screen} from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"
import NewBlogForm from "./NewBlog"
import { MemoryRouter } from "react-router-dom"
import BlogForm from "./BlogForm"
import blogService from '../services/blogs'

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

    render(
        <MemoryRouter>
            <BlogForm blogs={[blog]} setBlogs={() => {}} />
        </MemoryRouter>
    )

    expect(screen.findByText("React patterns")).toBeDefined()
    expect(screen.findByText("Michael Chan")).toBeDefined()

    expect(screen.queryByText("example.com")).toBeNull()
    expect(screen.queryByText("5")).toBeNull()
    expect(screen.queryByText("testuser name")).toBeNull()
})

test("show info but no buttons if no user", async () => {
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


    render(
        <MemoryRouter>
            <Blog blog={blog} blogs={{blog}} setBlogs={() => {}} user={null} />
        </MemoryRouter>
    )

    expect(screen.findByText("React patterns")).toBeDefined()
    expect(screen.findByText("Michael Chan")).toBeDefined()
    expect(screen.queryByText("example.com")).toBeDefined()
    expect(screen.queryByText("2")).toBeDefined()
    expect(screen.queryByText("testuser name")).toBeDefined()
    expect(screen.queryByRole("button", {name: "delete"})).toBeNull()
    expect(screen.queryByRole("button", {name: "like"})).toBeNull()
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

    const user = userEvent.setup()
    const mockHandler = vi.fn()

    mockHandler.mockResolvedValue({
        ...blog,
        id: '123',
        likes: 3
    })

    render(
        <MemoryRouter>
            <Blog blog={blog} blogs={[blog]} setBlogs={() => {}} updateLikes={mockHandler} user={{username: "root", name: "root"}} />
        </MemoryRouter>
    )

    const likebutton = screen.getByText("like")
    await user.click(likebutton)
    await user.click(likebutton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test("test return correct response data after creating blog", async () => {
    const user = userEvent.setup()

    vi.spyOn(blogService, "create").mockResolvedValue({
        id: "123",
        title: "Test title",
        author: "Test author",
        url: "Testurl.com"
    })

    render(
        <MemoryRouter>  
            <NewBlogForm user={{username: "root", name: "root"}} blogs={[]} setBlogs={() => {}} />
        </MemoryRouter>
    )

    const titleInput = screen.getByLabelText("title")
    const authorInput = screen.getByLabelText("author")
    const urlInput = screen.getByLabelText("url")
    
    await user.type(titleInput, "Test title")
    await user.type(authorInput, "Test author")
    await user.type(urlInput, "Testurl.com")

    const createButton = screen.getByRole("button", {name: "create"})
    await user.click(createButton)

    expect(blogService.create.mock.calls).toHaveLength(1)
    expect(blogService.create.mock.calls[0][0]).toEqual({
        title: "Test title",
        author: "Test author",
        url: "Testurl.com"
    })
})

test("show only like button to user who is not blog creator", async () => {
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


    render(
        <MemoryRouter>
            <Blog blog={blog} blogs={{blog}} setBlogs={() => {}} user={{username: "root", name: "root"}} />
        </MemoryRouter>
    )

    expect(screen.queryByRole("button", {name: "delete"})).toBeNull()
    expect(screen.queryByRole("button", {name: "like"})).toBeDefined()
})

test("show delete button to creator", async () => {
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


    render(
        <MemoryRouter>
            <Blog blog={blog} blogs={{blog}} setBlogs={() => {}} user={{username: "testuser", name: "testuser name"}} />
        </MemoryRouter>
    )

    expect(screen.queryByRole("button", {name: "delete"})).toBeDefined()
    expect(screen.queryByRole("button", {name: "like"})).toBeDefined()
})