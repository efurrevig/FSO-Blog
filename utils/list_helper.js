const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((a,b) => { return a + b.likes }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((a,b) => {
        if (b.likes > a.likes) {
            return b
        } else {
            return a
        }
    })
}

const mostBlogs = (blogs) => {
    if (_.isEmpty(blogs)) {
        return null
    }

    const blogCount = _.countBy(blogs, 'author')
    const maxCount = _.max(Object.values(blogCount))
    const topAuthor = _.findKey(blogCount, (count) => count === maxCount)

    return {
        author: topAuthor,
        blogs: maxCount
    }
}

const mostLikes = (blogs) => {
    if (_.isEmpty(blogs)) {
        return null
    }

    const authors = _.groupBy(blogs, 'author')
    const authorLikes = _.map(authors, (blogs, author) => ({
        author,
        likes: _.sumBy(blogs, 'likes')
    }))
    const maxAuthor = _.maxBy(authorLikes, 'likes')

    return {
        author: maxAuthor.author,
        likes: maxAuthor.likes
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}