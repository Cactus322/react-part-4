var _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((acc, blog) => acc.likes > blog.likes ? acc : blog)
}

const mostBlogs = (blogs) => {
    const authorGroup = _(blogs).groupBy('author').map(
        group => {
            return ({ author: group[0].author, blogs: group.length })
        }
    )

    return _.chain(authorGroup).maxBy('blogs').value()
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}