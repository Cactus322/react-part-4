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
        title: body.titile,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    blog
        .save().then((result) => {
            response.status(201).json(result)
        })
})

module.exports = blogsRouter