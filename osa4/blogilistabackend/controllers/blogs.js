const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
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

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body)

  if (!request.body.title || !request.body.url) {
    response.status(400).json({error: "title or url missing"})
  } else {
    const result = await blog.save()
    response.status(201).json(result)
  }
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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