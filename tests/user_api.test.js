const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('user post valid', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('a valid user can be added', async () => {
        const newUser = {
            username: 'Tester',
            name: 'test',
            passwordHash: 'test',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const usernames = response.body.map(r => r.username)

        expect(usernames).toContain(
            'Tester'
        )
    })

    test('invalid username length', async () => {
        const newUser = {
            username: 'te',
            name: 'test',
            passwordHash: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('username is taken', async () => {
        const newUser = {
            username: 'root',
            name: 'test',
            passwordHash: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('invalid password length', async () => {
        const newUser = {
            username: 'test1',
            name: 'test',
            passwordHash: 'te'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})