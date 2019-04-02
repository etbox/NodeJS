const router = require('koa-router')()
const mongoose = require('mongoose')
const crypto = require('crypto')

const md5 = data => crypto
		.createHash('md5')
		.update(data)
		.digest('hex')

const userSchema = new mongoose.Schema({
	name: String,
	salt: Number,
	password: String,
})
const User = mongoose.model('User', userSchema)

const numberSchema = new mongoose.Schema({
	userID: mongoose.Schema.Types.ObjectId,
	number: Number,
})
const Num = mongoose.model('Num', numberSchema)

router
	.get('/', async (ctx) => {
		const title = 'Home'
		const userName = 'World'
		const btnLeft = '/Register'
		const btnRight = '/Login'
		await ctx.render('index', {
			title,
			userName,
			btnLeft,
			btnRight,
		})
	})
	.get('/register', async (ctx) => {
		const title = 'Register'
		const btnLeft = '/Register'
		const btnRight = '/Login'
		await ctx.render('forms', {
			title,
			btnLeft,
			btnRight,
		})
	})
	.get('/check-name', async (ctx) => {
		// ajax 请求检查是否重名
		let name = ctx.url.split('?')[1]
		console.log(`check username: ${name}`)

		await mongoose.connect('mongodb://localhost:27017/task6', {
			useNewUrlParser: true,
		})
		const response = await User.find({ name })
		console.log(`result: ${response}`)
		if (response.length === 0) {
			name = 'no result'
		}
		ctx.body = name
	})
	.get('/login', async (ctx) => {
		const title = 'Login'
		const btnLeft = '/Login'
		const btnRight = '/Register'
		await ctx.render('forms', {
			title,
			btnLeft,
			btnRight,
		})
	})
	.post('/register', async (ctx) => {
		const form = ctx.request.body
		const salt = Math.random()
		const newUser = new User({
			name: form.username,
			salt,
			// 在这里调用 this 会指向全局
			password: md5(`${form.username}${salt}${form.password}`),
		})
		await mongoose.connect('mongodb://localhost:27017/task6', {
			useNewUrlParser: true,
		})
		console.log(await newUser.save())
		// ctx.url = '/'
		ctx.body = newUser
	})
	.get('/start', async (ctx) => {
		const result = 'Input To Guess'
		await ctx.render('number-guesser', {
			result,
		})
	})
	.post('/:number', async (ctx) => {
		const clientNum = Number(ctx.params.number) // 只会在 post 请求触发
		console.log(`clientNum: ${clientNum}`)

		const serverNum = Number(ctx.serverNum)

		let result

		if (Number.isNaN(serverNum) || Number.isNaN(clientNum)) {
			// 发生意外
			result = 'Something Goes Wrong'
			await ctx.render('number-guesser', {
				result,
			})
		} else {
			if (clientNum < serverNum) {
				result = 'Smaller'
			} else if (clientNum > serverNum) {
				result = 'Bigger'
			} else if (clientNum === serverNum) {
				result = 'Equal'
			}
			await ctx.render('number-guesser', {
				result,
			})
		}
	})

module.exports = {
	route: () => router.routes(),
}
