const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
let token = ''

const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
]

beforeAll(async () => {
    await User.deleteMany({})

    await api
        .post('/api/users')
        .send({
            username: 'Admin',
            name: 'Michael Chan',
            passwordHash: 'admin',
        })
})

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()

    const response = await api
        .post('/api/login')
        .send({
            username: 'Admin',
            password: 'admin'
        })

    token = response.body.token
})

describe('other tests', () => {
    test('blogs length', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(2)
    })

    test('blogs id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach((e) => {
            expect(e.id).toBeDefined()
        })
    })
})

describe('post valid', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain(
            'First class tests'
        )
    }, 15000)

    test('a valid likes', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const likes = response.body.map(r => r.likes)

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(likes).toBeDefined()
    })

    test('a invalid blog can not be added', async () => {
        const newBlog = {
            author: 'Robert C. Martin',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('deletion valid', () => {
    test('succeeds delete', async () => {
        const blogToDelete = initialBlogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .expect(204)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length - 1)
        expect(response.body).not.toContain(blogToDelete.title)
    }, 15000)
})

describe('updation valid', () => {
    test('succeeds update', async () => {
        const blogToUpdate = initialBlogs[0]

        const updateBlog = {
            likes: 3
        }

        await api
            .put(`/api/blogs/${blogToUpdate._id}`)
            .send(updateBlog)
            .expect(200)

        const response = await api.get('/api/blogs')
        const likes = response.body.map(l => l.likes)

        expect(response.body).toHaveLength(initialBlogs.length)
        expect(likes[0]).toBe(3)
    })
})

afterAll(() => {
    mongoose.connection.close()
})