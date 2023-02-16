const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {
		author: 1,
		title: 1,
		url: 1,
		likes: 1,
	})

	response.json(users)
})

usersRouter.post('/', async (request, response) => {
	const { username, name, passwordHash } = request.body
	let usernameIsTaken = false

	const usernames = await User.find({})

	usernames.forEach((e) => {
		if (e.username === username) {
			usernameIsTaken = true
		}
	})

	if (username.length < 3 || passwordHash.length < 3) {
		return response.status(400).json({
			error: 'content missing',
		})
	} else if (usernameIsTaken) {
		return response.status(400).json({
			error: 'username is taken',
		})
	}

	const saltRounds = 10
	const password = await bcrypt.hash(passwordHash, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash: password,
	})

	const savedUser = await user.save()

	response.status(201).json(savedUser)
})

module.exports = usersRouter
