const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/:id/comments', async (request, response) => {
	const comments = await Comment.find({})

	response.json(comments)
})

commentsRouter.post('/:id/comments', async (request, response) => {
    const body = request.body
    const blog = await Blog.findById(request.params.id)

    if (!body.text) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const comment = new Comment({
        text: body.text,
    })

    const saveComment = await comment.save()
    blog.comments = blog.comments.concat(saveComment._id)
    await blog.save()

    response.status(201).json(saveComment)
})

commentsRouter.delete('/:id/comments/:id', async (request, response) => {
    console.log(request.params.id);
	const commentDelete = await Comment.findByIdAndRemove(request.params.id)
    console.log(commentDelete);
	response.status(204).json(commentDelete)
})

module.exports = commentsRouter