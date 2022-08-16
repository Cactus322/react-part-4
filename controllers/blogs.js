const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

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
        user: user._id
    })

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (user._id.toString() !== blog.user._id.toString()) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const blogDelete = await Blog
        .findByIdAndRemove(request.params.id)

    response.status(204).json(blogDelete)
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