const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')


commentsRouter.post('/', async (request, response, next) => {
    const body = request.body.comment
    const blog = await Blog.findById(request.body.blog.id)
    console.log(blog)
    const comment = new Comment({
        content: body.content,
        blog: blog.id
    })

    const savedComment = await comment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    const updatedBlog = {
        ...blog,
        user: blog.user.id
    }
    await blog.save()

    response.status(201).json(savedComment)
})

module.exports = commentsRouter