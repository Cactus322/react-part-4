const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({}).then((blogs) => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    blog
        .save().then((result) => {
            response.status(201).json(result)
        })
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
    // .then(updateBlog => {
    //     response.status(200).json(updateBlog)
    // })
})

module.exports = blogsRouter