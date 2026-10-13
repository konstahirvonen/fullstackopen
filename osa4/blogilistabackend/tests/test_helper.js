const Blog = require("../models/blog")

const initialBlogs = [
    {
        "title": "React patterns",
        "author": "Michael Chan",
        "url": "https://reactpatterns.com/",
        "likes": 7,
        "id": "6acb7604e2a81a3153e0ccd1"
    },
    {
        "title": "Go To Statement Considered Harmful",
        "author": "Edsger W. Dijkstra",
        "url": "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        "likes": 5,
        "id": "6acb7604e2a81a3153e0ccd2"
    },
    {
        "title": "Canonical string reduction",
        "author": "Edsger W. Dijkstra",
        "url": "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        "likes": 12,
        "id": "6acb7604e2a81a3153e0ccd3"
    },
    {
        "title": "First class tests",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
        "likes": 10,
        "id": "6acb7604e2a81a3153e0ccd4"
    },
    {
        "title": "TDD harms architecture",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        "likes": 0,
        "id": "6acb7604e2a81a3153e0ccd5"
    },
    {
        "title": "Type wars",
        "author": "Robert C. Martin",
        "url": "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        "likes": 2,
        "id": "6acb7604e2a81a3153e0ccd6"
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {initialBlogs, blogsInDb}