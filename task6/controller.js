const router = require('koa-router')()
const mongoose = require('mongoose')
const crypto = require('crypto')

// 将 md5 封装为函数以直接调用
const md5 = data => crypto
		.createHash('md5')
		.update(data)
		.digest('hex')

// schema 和 model 全局只能存在一个，不能等路由时再次定义，会报错
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
		// 检查是否有登录
		const sessionName = ctx.session.isLogin ? ctx.session.username : ''
		const title = 'Home'
		const userName = sessionName || 'World!'
		// 登录与否功能不同
		const btnLeft = sessionName ? '/Start' : '/Register'
		const btnRight = sessionName ? '/Logout' : '/Login'
		await ctx.render('index', {
			title,
			userName,
			btnLeft,
			btnRight,
		})
	})
	.get('/favicon.ico', () => null)
	.get('/register', async (ctx) => {
		// 已登录则免去多余的表单提交
		if (ctx.session.isLogin) {
			ctx.redirect('/')
			ctx.status = 302
		}
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
		const findRes = await User.find({ name })
		console.log(`result: ${findRes}`)
		if (findRes.length === 0) {
			name = 'no result'
		}
		ctx.body = name
	})
	.post('/register', async (ctx) => {
		const form = ctx.request.body
		await mongoose.connect('mongodb://localhost:27017/task6', {
			useNewUrlParser: true,
		})
		// 防止反复提交，确认数据库没有后才提交
		const findRes = await User.find({ name: form.username })
		if (findRes.length === 0) {
			const salt = Math.random()
			const newUser = new User({
				name: form.username,
				salt,
				// 在这里调用 this 会指向全局
				password: md5(`${form.username}${salt}${form.password}`),
			})
			const saveRes = await newUser.save()
			console.log(saveRes)
			ctx.session.userID = saveRes._id
			ctx.session.username = form.username
			ctx.session.isLogin = true
		}
		ctx.redirect('/')
		ctx.status = 303
	})
	.get('/logout', (ctx) => {
		// 取消登录状态并跳转回首页
		ctx.session.isLogin = false
		ctx.redirect('/')
		ctx.status = 302
	})
	.get('/login', async (ctx) => {
		// 已登录则免去多余的表单提交
		if (ctx.session.isLogin) {
			ctx.redirect('/')
			ctx.status = 302
		}
		const title = 'Login'
		const btnLeft = '/Login'
		const btnRight = '/Register'
		await ctx.render('forms', {
			title,
			btnLeft,
			btnRight,
		})
	})
	.post('/login', async (ctx) => {
		const form = ctx.request.body
		const btnLeft = '/Login'
		const btnRight = '/Register'
		let title = 'Login'
		await mongoose.connect('mongodb://localhost:27017/task6', {
			useNewUrlParser: true,
		})
		// 登录时要确认有账号
		const findRes = await User.find({ name: form.username })
		if (findRes.length) {
			const userInfo = findRes[0]
			const postPW = md5(`${form.username}${userInfo.salt}${form.password}`)
			// 验证密码
			if (postPW === userInfo.password) {
				ctx.session.userID = userInfo._id
				ctx.session.username = form.username
				ctx.session.isLogin = true
				// redirect 相当于 return
				ctx.redirect('/')
				ctx.status = 303
			} else {
				title = 'Wrong Username Or Password'
			}
		} else {
			title = 'Username Dose Not Exist'
		}
		// 登录成功后会跳转至首页，异常则重新渲染带错误信息的 login 页面
		await ctx.render('forms', {
			title,
			btnLeft,
			btnRight,
		})
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
