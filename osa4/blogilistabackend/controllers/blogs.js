const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const { userExtractor, tokenExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user")
  response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post("/", tokenExtractor, userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({error: "userId missing or not valid"})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!request.body.title || !request.body.url) {
    response.status(400).json({error: "title or url missing"})
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete("/:id", tokenExtractor, userExtractor, async (request, response) => {

  const user = request.user

  if (!user) {
    return response.status(400).json({error: "userId missing or not valid"})
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }

  return response.status(403).json({error: "forbidden"})
})

blogsRouter.put("/:id", async (request, response) => {
  const {likes} = request.body
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const result = await blog.save()
  response.status(200).json(result)
})

module.exports = blogsRouter