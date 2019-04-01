const router = require('koa-router')()
const mongoose = require('mongoose')

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
	.get('/check-name', async (ctx, next) => {
		let name = ctx.url.split('?')[1]
		console.log(`username: ${name}`)

		mongoose
			.connect('mongodb://localhost/task6', { useNewUrlParser: true })
			.then(() => {
				User.find({ name }).then((res) => {
					console.log(res)
					if (res.length === 0) {
						name = 'no result'
					}
				})
			})
			.catch(err => console.log(err))

		await next() // TODO: 异步 body
		ctx.body = name
	})
	.post('/register', async (ctx) => {
		console.log(ctx.request.body)
		ctx.body = ctx.request.body
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

mongoose
	.connect('mongodb://localhost/task6', { useNewUrlParser: true })
	.then(() => {
		console.log('Connected to task6!')

		const admin = new User({
			name: 'admin',
			salt: Math.random(),
			password: 'admin',
		})

		// admin
		// 	.save()
		// 	.then(res => console.log(res))
		// 	.catch(err => console.log(err))
	})
	.catch(err => console.log(err))

module.exports = {
	route: () => router.routes(),
}
