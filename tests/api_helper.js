const Blog = require('../models/blog')

const initialBlogs= [
    {
        title: 'Testing the backend',
        author: 'Full Stack Open',
        url: 'google.com',
        likes: 10
    },
    {
        title: 'Testing the frontend',
        author: 'Full Stack Open',
        url: 'google.com',
        likes: 9
    },
    {
        title: 'How to train your dog',
        author: 'John Smith',
        url: 'google.com',
        likes: 15
    },
    {
        title: '10 ways to break your website',
        author: 'Anon',
        url: 'google.com',
        likes: 21
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = await new Blog({
        title: 'temp',
        author: 'temp',
        url: 'temp',
        likes : 0
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}