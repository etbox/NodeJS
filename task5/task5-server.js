// #! /usr/bin/env node
// 这句是直接运行task3而不是运行node时才需要的

const Koa = require('koa')
const Router = require('koa-router')
const redis = require('redis')
const {
	promisify,
} = require('util')
const program = require('commander')

const app = new Koa()
const router = new Router()
const client = redis.createClient() // 连接redis
const getAsync = promisify(client.get).bind(client) // 使用promise取得redis的数据

client.on('connect', () => { // 提示已连接redis
	console.log('connected to Redis!')
})

router.get('/', (ctx, next) => {
	ctx.body = 'Hello World'
}).get('/start', (ctx, next) => {
	ctx.body = 'OK'

	const num = Math.floor(Math.random() * 1000000)
	client.set('number', num, () => {
		console.log(`random number: ${num}`)
	})
}).get('/:number', async (ctx, next) => {
	const clientNum = Number(ctx.params.number) // 请求favicon.ico时也会触发
	console.log(`clientNum: ${clientNum}`)

	await next()

	const serverNum = Number(ctx.serverNum)

	if (ctx.serverNum === null) { // number未设置的情况
		ctx.body = '<h1 style="text-align: center">please enter /start first</h1>'
	} else if (ctx.serverNum === undefined) { // redis炸了需要重启
		ctx.body = '<h1 style="text-align: center">please shutdown Redis and relaunch it</h1>'
	} else if (clientNum < serverNum) {
		ctx.body = 'smaller'
	} else if (clientNum > serverNum) {
		ctx.body = 'bigger'
	} else if (clientNum === serverNum) {
		ctx.body = 'equal'
		// ctx.body = 'equal!' // 故意写多感叹号以报错
	}
})

program
	.option('-p, --port <n>', '端口号', parseInt) // 使用命令行指定服务器监听的端口号
	.parse(process.argv)

console.log('port: %j', program.port || 3000)
if (!program.port) {
	program.port = 3000
}

async function getNumber() { // 函数定义放外面，不要在函数里定义函数；async表明返回值为Promise
	return getAsync('number')
}

app
	.use(router.routes())
	.use(router.allowedMethods())
	.use(async (ctx) => { // 异步获取数据，并将数据保存在ctx中
		ctx.serverNum = await getNumber()
	})
	.listen(program.port)
