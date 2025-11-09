const supertest = require('supertest')
const mongoose = require('mongoose')
const { describe, test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../src/app')
const testHelper = require('./test_helper')

const api = supertest(app)

before(async () => {
  await testHelper.clearBlogTestDb()
})

after(async () => {
  await testHelper.clearBlogTestDb()
  await mongoose.connection.close()
})

describe('GET /api/blogs', async () => {
  const blogCount = 10
  before(async () => {
    await testHelper.initBlogTestDb(blogCount)
  })

  test('returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, blogCount)
  })

  test('returns blogs and every blog has id field not _id', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.ok(response.body.every(blog => blog.id !== undefined && !blog._id))
  })
})

describe('POST /api/blogs', async () => {
  const initialBlogCount = 2
  beforeEach(async () => {
    await testHelper.initBlogTestDb(initialBlogCount)
  })

  test('new blog can be added', async () => {
    const payload = {
      title: 'New blog',
      url: 'https://blogs.com/new_blog',
      author: 'blog autor',
      likes: 23
    }
    const response = await api.post('/api/blogs')
      .send(payload)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await api.get('/api/blogs')
    assert.strictEqual(response.body.title, payload.title)
    assert.strictEqual(response.body.url, payload.url)
    assert.strictEqual(response.body.author, payload.author)
    assert.strictEqual(allBlogs.body.length, initialBlogCount + 1)
    assert.ok(allBlogs.body.map(b => b.id).includes(response.body.id))
  })

  test('likes field defaults to 0', async () => {
    const payload = {
      title: 'New blog',
      url: 'https://blogs.com/new_blog',
      author: 'Blog author'
    }
    const response = await api.post('/api/blogs')
      .send(payload)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, payload.title)
    assert.strictEqual(response.body.url, payload.url)
    assert.strictEqual(response.body.author, payload.author)
    assert.strictEqual(response.body.likes, 0)
  })

  test('missing title field causes 400', async () => {
    const payload = {
      url: 'https://blogs.com/new_blog'
    }
    const response = await api.post('/api/blogs')
      .send(payload)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('title'),
      'error message should contain missing field (title)')
  })

  test('missing url field causes 400', async () => {
    const payload = {
      title: 'New blog'
    }
    const response = await api.post('/api/blogs')
      .send(payload)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.error.includes('url'),
      'error message should contain missing field (url)')
  })
})

describe('DELETE /api/blogs/:id', async () => {
  let blogs
  beforeEach(async () => {
    blogs = await testHelper.initBlogTestDb(1)
  })

  test('deletes blog by id', async () => {
    const id = blogs[0].id
    await api.delete(`/api/blogs/${id}`).expect(204)

    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.equal(response.body.length, 0)
  })
})

describe('PUT /api/blogs/:id', async () => {
  let blogs
  beforeEach(async () => {
    blogs = await testHelper.initBlogTestDb(1)
  })

  test('all fields are updated', async () => {
    const blogBefore = blogs[0]
    const payload = {
      title: 'updated blog',
      author: 'updated author',
      url: 'https://blogs.com/updated_blog',
      likes: blogBefore.likes + 19
    }

    await api.put(`/api/blogs/${blogBefore.id}`)
      .send(payload)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const getAllResponse = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAfter = getAllResponse.body[0]
    assert.strictEqual(blogAfter.title, payload.title)
    assert.strictEqual(blogAfter.url, payload.url)
    assert.strictEqual(blogAfter.author, payload.author)
    assert.strictEqual(blogAfter.likes, payload.likes)
  })

  test('only likes field is updated', async () => {
    const blogBefore = blogs[0]
    const payload = {
      likes: blogBefore.likes + 24
    }

    await api.put(`/api/blogs/${blogBefore.id}`)
      .send(payload)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const getAllResponse = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAfter = getAllResponse.body[0]
    assert.strictEqual(blogAfter.title, blogBefore.title)
    assert.strictEqual(blogAfter.url, blogBefore.url)
    assert.strictEqual(blogAfter.likes, payload.likes)
  })

  test('upadting non-existing blog returns 404', async () => {
    const blogBefore = blogs[0]
    const payload = {
      likes: blogBefore.likes + 12
    }
    // replace last char to ensure non-existing id
    const id = blogBefore.id
    const nonExistingId = id.substring(0, id.length - 1) +
      (id[id.length - 1] !== 'a' ? 'a' : 'b')

    await api.put(`/api/blogs/${nonExistingId}`)
      .send(payload)
      .expect(404)
  })
})

describe('GET /api/users', async () => {
  let users
  before(async () => {
    users = [
      await testHelper.createUser('test_user_0', 'Test User0', 'pass1234'),
      await testHelper.createUser('test_user_1', 'Test User1', 'pass1234')
    ]
  })

  test('returns all users', async () => {
    const response = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    for (const user of users) {
      const returnedUser = response.body.find(u => u.username === user.username)
      assert.deepStrictEqual(returnedUser, user.toJSON())
    }
  })
})

describe('POST /api/users', async () => {
  let existingUser
  before(async () => {
    await testHelper.clearBlogTestDb()
    existingUser = await testHelper.createUser('test_user_0', 'Test User1', 'pass3456')
  })
  test('new user can be added', async () => {
    const payload = {
      username: 'test_user_1',
      name: 'Test User1',
      password: 'pass123'
    }

    await api.post('/api/users')
      .send(payload)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allUsersResponse = await api.get('/api/users')
    const user = allUsersResponse.body.find(u => u.username === payload.username)
    assert.strictEqual(payload.username, user.username)
    assert.strictEqual(payload.name, user.name)
    assert.ok(user.id)
  })

  test('duplicate username returns 400', async () => {
    const payload = existingUser.toJSON()

    await api.post('/api/users')
      .send(payload)
      .expect(400)
  })

  test('too short username returns 400', async () => {
    const payload = {
      username: 'us',
      password: 'pass1234',
      name: 'User'
    }
    await api.post('/api/users')
      .send(payload)
      .expect(400)
  })

  test('too short password returns 400', async () => {
    const payload = {
      username: 'test_user_999',
      password: '12',
      name: 'User'
    }
    await api.post('/api/users')
      .send(payload)
      .expect(400)
  })
})