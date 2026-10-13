const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((favourite, blog) => {
        if (blog.likes > favourite.likes) {
            return blog
        }
        return favourite
    })
}

const mostBlogs = (blogs) => {
    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})
    
    const entries = Object.entries(authorCounts)

    const most = entries.reduce((most, entry) => {
        if (entry[1] > most[1]) {
            return entry
        }
        return most
    })

    return {
        author: most[0],
        blogs: most[1]
    }
}

const mostLikes = (blogs) => {
    const likeCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + blog.likes
        return counts
    }, {})

    const entries = Object.entries(likeCounts)

    const most = entries.reduce((most, entry) => {
        if (entry[1] > most[1]) {
            return entry
        }
        return most
    })

    return {
        author: most[0],
        likes: most[1]
    }
}

module.exports = {dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes}