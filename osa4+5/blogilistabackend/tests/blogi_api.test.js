const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 6)
})

test('blog identifying field is id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('new blog added', async () => {

  const user = {
    username: 'testUser',
    password: 'password'
  }

  await api.post('/api/users').send(user)

  const testUser = await api
    .post('/api/login')
    .send({
      username: 'testUser',
      password: 'password'
    })

  const token = testUser.body.token

  const newBlog = {
    title: 'test blog',
    author: 'test',
    url: 'testblog',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('if likes is empty set value to 0', async () => {

  const user = {
    username: 'testUser',
    password: 'password'
  }

  await api.post('/api/users').send(user)

  const testUser = await api
    .post('/api/login')
    .send({
      username: 'testUser',
      password: 'password'
    })

  const token = testUser.body.token

  const newBlog = {
    title: 'test blog2',
    author: 'test2',
    url: 'testblog1',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body.likes, 0)
})

test('if title or url is empty response = 400 bad request', async () => {

  const user = {
    username: 'testUser',
    password: 'password'
  }

  await api.post('/api/users').send(user)

  const testUser = await api
    .post('/api/login')
    .send({
      username: 'testUser',
      password: 'password'
    })

  const token = testUser.body.token

  const newBlog = {}

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('delete blog by id', async () => {

  const user = {
    username: 'testUser',
    password: 'password'
  }

  await api.post('/api/users').send(user)

  const testUser = await api
    .post('/api/login')
    .send({
      username: 'testUser',
      password: 'password'
    })

  const token = testUser.body.token

  const newBlog = {
    title: 'test blog2',
    author: 'test2',
    url: 'testblog1',
  }

  const blogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsToDelete = blogResponse.body

  await api
    .delete(`/api/blogs/${blogsToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogsToDelete.id))
})

test('update likes on existing blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedLikes = {
    likes: 20
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200)

  const response = await api
    .get(`/api/blogs/${blogToUpdate.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, updatedLikes.likes)
})

after(async () => {
  await mongoose.connection.close()
})