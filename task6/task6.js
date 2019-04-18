const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const mongoose = require('mongoose')
const controller = require('./controller')

const app = new Koa()
require('koa-qs')(app)

app.keys = ['some secret hurr'] // 用于计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改

app
	.use(async (ctx, next) => {
		// 中间件内做数据库连接，这样就不用每个handler都创建链接了
		await mongoose.connect('mongodb://localhost:27017/task6', {
			useNewUrlParser: true,
		})
		await next()
	})
	.use(
		views(path.join(__dirname, './views'), {
			// 加载模板引擎
			extension: 'ejs',
		}),
	)
	.use(bodyParser()) // 处理 post 表单
	.use(async (ctx, next) => {
		// 服务器收到请求，将其打印出来
		console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`)
		await next()
	})
	.use(
		session(
			{
				key: 'username',
			},
			app,
		),
	) // 操作 session
	.use(controller.route()) // 路由处理
	.listen(3000)
