const program = require('commander')
const Koa = require('koa')
const serve = require('koa-static')
const views = require('koa-views')
const path = require('path')
const controller = require('./controller')

const app = new Koa()

program
	.option('-p, --port <n>', '端口号', parseInt) // 使用命令行指定服务器监听的端口号
	.parse(process.argv)

console.log('port: %j', program.port || 3000)
if (!program.port) {
	program.port = 3000
}

app
	.use(async (ctx, next) => { // 服务器收到请求，将其打印出来
		console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`)
		await next()
	})
	.use(serve(path.join(__dirname, './static'))) // 处理静态资源
	.use(views(path.join(__dirname, './views'), { // 加载模板引擎
		extension: 'ejs',
	}))
	.use(controller.route()) // 路由处理
	.use(async (ctx) => { // 将 redis 里的数保存在 ctx 中
		await controller.getNumber(ctx)
	})
	.listen(program.port)
