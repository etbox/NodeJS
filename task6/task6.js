const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')

const app = new Koa()

app
	.use(async (ctx, next) => {
		// 服务器收到请求，将其打印出来
		console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`)
		await next()
	})
	.use(
		views(path.join(__dirname, './views'), {
			// 加载模板引擎
			extension: 'ejs',
		}),
	)
	.use(bodyParser()) // 处理 post 表单
	.use(controller.route()) // 路由处理
	.listen(3000)
