const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helpers/api_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')


describe('when there are blogs in the db', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        for (let blog of helper.initialBlogs) {
            let newBlog = new Blog(blog)
            await newBlog.save()
        }
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are initialBlogs length blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)

        expect(contents).toContain('Testing the backend')
    })

    test('a blog has an "id" property (not "_id")', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        expect(blog.id).toBeDefined()
    })

})

describe('a blog can be added to the database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()

        await Blog.deleteMany({})
        for (let blog of helper.initialBlogs) {
            let newBlog = new Blog(blog)
            await newBlog.save()
        }

    })

    test('a valid blog can be added to the database', async () => {
        const newBlog = {
            title: 'test title',
            author: 'test author',
            url: 'testurl.com',
            likes: 1
        }

        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loggedInUser.body.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('test title')
    })

    test('a new blog added without likes specified will have likes defaulted to 0', async () => {
        const blog = new Blog({
            title: 'like test',
            author: 'test author',
            url: 'testurl.com',
        })

        const savedBlog = await blog.save()
        expect(savedBlog.likes).toBe(0)

    })

    test('a new blog without a title will not save', async () => {
        const newBlog = {
            author: 'test author',
            url: 'testurl.com',
            likes: 0
        }

        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loggedInUser.body.token}`)
            .send(newBlog)
            .expect(400)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

    test('a new blog without a url will not save', async () => {
        const newBlog = {
            title: 'test title',
            author: 'test author',
            likes: 0
        }

        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loggedInUser.body.token}`)
            .send(newBlog)
            .expect(400)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

})

describe('a blog can be deleted from the database', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()

        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loggedInUser.body.token}`)
            .send(helper.initialBlogs[0])

    })

    test('succeeds with statuscode 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        const loggedInUser = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${loggedInUser.body.token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const contents = blogsAtEnd.map(b => b.title)
        expect(contents).not.toContain(blogToDelete.title)
    })

    // test('fails with statuscode 403 if user isnt author of blog', async () => {
    //     const blogsAtStart = await helper.blogsInDb()
    //     const blogToDelete = blogsAtStart[0]
    // })
})

describe('a blog in the database can be edited', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        for (let blog of helper.initialBlogs) {
            let newBlog = new Blog(blog)
            await newBlog.save()
        }
    })
    test('succeeds with statuscode 200 if valid edit', async () => {
        //note to be edited
        //new note to replace note to be edited
        const blogsAtStart = await helper.blogsInDb()
        const blogToEdit = blogsAtStart[0]

        const newBlog = {
            title: 'edited note',
            author: 'edited author',
            url: 'edited url',
            likes: 2
        }

        await api
            .put(`/api/blogs/${blogToEdit.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const editedBlog = await api.get(`/api/blogs/${blogToEdit.id}`)

        expect(editedBlog.body.id).toEqual(blogToEdit.id)
        expect(editedBlog.body.title).toBe('edited note')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})