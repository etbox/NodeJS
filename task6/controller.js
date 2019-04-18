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
		let { name } = ctx.query
		console.log(`check username: ${name}`)

		const findRes = await User.findOne({
			name,
		})
		console.log(`find result: ${findRes}`)
		// 无结果时 findRes 为 null
		if (!findRes) {
			name = 'no result'
		}
		ctx.body = name
	})
	.post('/register', async (ctx) => {
		const form = ctx.request.body
		const findRes = await User.findOne({ name: form.username })
		// 防止反复提交，确认数据库没有后才提交
		if (!findRes) {
			const salt = Math.random()
			const newUser = new User({
				name: form.username,
				salt,
				// 在这里调用 this 会指向全局
				password: md5(`${form.username}${salt}${form.password}`),
			})
			const saveRes = await newUser.save()
			console.log(saveRes)
			// 数据保存在 session 中
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

		const findRes = await User.findOne({ name: form.username })
		// 登录时要确认有账号
		if (findRes) {
			const userInfo = findRes
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
		// 拦截未登录用户
		if (!ctx.session.isLogin) {
			ctx.redirect('/')
			ctx.status = 302
		}

		const num = Math.floor(Math.random() * 100)
		console.log(`sever number: ${num}`)
		const findRes = await Num.findOne({ userID: ctx.session.userID })
		console.log(`find result: ${findRes}`)
		// 若数据库有记录，则更新数据
		if (findRes) {
			findRes.number = num
			const saveRes = await findRes.save()
			console.log(`save result: ${saveRes}`)
		} else {
			// 否则创建新数据
			const newNum = new Num({
				userID: ctx.session.userID,
				number: num,
			})
			const saveRes = await newNum.save()
			console.log(`save result: ${saveRes}`)
		}

		const result = 'Input To Guess'
		await ctx.render('number-guesser', {
			result,
		})
	})
	.post('/:number', async (ctx) => {
		// 拦截未登录用户
		if (!ctx.session.isLogin) {
			ctx.redirect('/')
			ctx.status = 302
		}

		const findRes = await Num.findOne({ userID: ctx.session.userID })
		const serverNum = findRes.number
		console.log(`serverNum: ${serverNum}`)

		const clientNum = Number(ctx.params.number) // 只会在 post 请求触发
		console.log(`clientNum: ${clientNum}`)

		let result = 'Something Goes Wrong' // 发生意外就会显示
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
	})

module.exports = {
	route: () => router.routes(),
}
