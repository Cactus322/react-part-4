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

blogsRouter.delete('/:id', (request, response) => {
    Blog.findByIdAndRemove(request.params.id)
        .then( () => {
            response.status(204).end()
        })
})

blogsRouter.put('/:id', (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    Blog.findByIdAndUpdate(request.params.id, blog)
        .then(updateBlog => {
            response.status(200).json(updateBlog)
        })
})

module.exports = blogsRouter