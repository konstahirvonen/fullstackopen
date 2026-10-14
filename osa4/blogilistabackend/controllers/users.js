const bcryptjs = require("bcryptjs")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs")
    response.json(users)
})

usersRouter.post("/", async (request, response) => {
    const {username, name, password} = request.body

    if (!request.body.username || !request.body.password) {
        return response.status(400).json({error: "username or password missing"})
    }
    
    if (request.body.username.length < 3 || request.body.password.length < 3 ) {
        return response.status(400).json({error: "username or password is too short"})
    }

    const existingUser = await User.findOne({username})

    if (existingUser) {
        return response.status(400).json({error: "username already exists"})
    }

    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter