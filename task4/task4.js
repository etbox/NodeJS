const program = require('commander')
const Koa = require('koa')
const serve = require('koa-static')
const views = require('koa-views')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')

const app = new Koa()

// log request URL:
app.use(async (ctx, next) => {
	console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`)
	const start = new Date().getTime()
	await next()
	const execTime = new Date().getTime() - start
	ctx.response.set('X-Response-Time', `${execTime}ms`)
})

program
	.option('-p, --port <n>', '端口号', parseInt) // 使用命令行指定服务器监听的端口号
	.parse(process.argv)

console.log('port: %j', program.port || 3000)
if (!program.port) {
	program.port = 3000
}

app
	.use(serve(`${__dirname}/static`)) // 处理静态资源
	.use(bodyParser()) // 解析 POST 请求
	.use(views(path.join(__dirname, './views'), { // 加载模板引擎
		extension: 'ejs',
	}))
	.use(async (ctx) => { // TODO: 这部分应该交给 controller 来做
		const title = 'hello koa2'
		await ctx.render('index', {
			title,
		})
	})
	// .use(controller())
	// .use(router.allowedMethods())
	.listen(program.port)
