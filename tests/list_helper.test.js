const listHelper = require('../utils/list_helper.js')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithMultipleBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'John Smith',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'John Smith',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'John Smith',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 15,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 25,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Jessie W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 25,
        __v: 0
    }
]

test('test returns 1', () => {
    expect(listHelper.dummy([])).toBe(1)
})

describe('total likes', () => {

    test('when list only has one blog, equals likes of that blog', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test('when list as multiple blogs, equals total likes of all blogs', () => {
        expect(listHelper.totalLikes(listWithMultipleBlogs)).toBe(100)
    })

    test('when list has no blogs, equals 0', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

})

describe('favorite blog', () => {

    test('when list has one blog, return that blog', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
    })

    test('when list has multiple blogs, return blog with highest like count', () => {
        expect(listHelper.favoriteBlog(listWithMultipleBlogs)).toEqual(listWithMultipleBlogs[4])
    })
})

describe('most blogs', () => {
    const oneBlog = {
        author: 'Edsger W. Dijkstra',
        blogs: 1
    }

    const multipleBlogs = {
        author: 'John Smith',
        blogs: 3
    }

    test('when list has one blog, return that author', () => {
        expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(oneBlog)
    })

    test('when list has multiple blogs, return author with most amount of blogs', () => {
        expect(listHelper.mostBlogs(listWithMultipleBlogs)).toEqual(multipleBlogs)
    })
})

describe('most likes by author', () => {
    const oneBlog = {
        author: 'Edsger W. Dijkstra',
        likes: 5
    }

    const multipleBlogs = {
        author: 'Edsger W. Dijkstra',
        likes: 45
    }

    test('when list has one blog, return author and their likes', () => {
        expect(listHelper.mostLikes(listWithOneBlog)).toEqual(oneBlog)
    })

    test('when list has multiple blogs, return author with most likes && total likes', () => {
        expect(listHelper.mostLikes(listWithMultipleBlogs)).toEqual(multipleBlogs)
    })

    test('when list is empty, expect null', () => {
        expect(listHelper.mostLikes([])).toEqual(null)
    })
})