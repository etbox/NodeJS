const program = require('commander')
const Koa = require('koa')
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
	.use(async (ctx, next) => {
		// 将 redis 里的数保存在 ctx 中
		ctx.serverNum = await controller.getNumber(ctx) // 不管用户怎么操作，先取数
		await next()
	})
	.use(controller.route()) // 路由处理
	.listen(program.port)
