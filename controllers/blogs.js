const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const users = await User.find({})
    const random = Math.floor(Math.random() * users.length)
    const randomUser = users[random]

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: randomUser
    })

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog
        .findByIdAndRemove(request.params.id)

    response.status(204).json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    const blogUpdate = await Blog
        .findByIdAndUpdate(request.params.id, blog)

    response.status(200).json(blogUpdate)
})

module.exports = blogsRouter