const bcryptjs = require('bcryptjs')
const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcryptjs.hash('password', 10)
  const user = new User({username: 'root', passwordHash})

  await user.save()
})

test('add valid user', async () => {
    
  const newUser = {
    username: 'Konsta',
    name: 'Konsta Hirvonen',
    password: '1234',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('missing username or password', async () => {
  const newUser = {
    name: 'Konsta'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('too short username and password', async () => {
  const newUser = {
    username: 'Ko',
    password: '12'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('adding user with same username', async () => {
  const newUser = {
    username: 'root',
    name: 'root root',
    password: 'password'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})


after(async () => {
  await mongoose.connection.close()
})