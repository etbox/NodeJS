const Koa = require('koa')
const Router = require('koa-router')
const redis = require('redis')
const {
	promisify,
} = require('util')

const app = new Koa()
const router = new Router()
const client = redis.createClient()
const getAsync = promisify(client.get).bind(client)

client.on('connect', () => {
	console.log('connected!')
})

// let getCtx
// client.set('number', '')
router.get('/', (ctx, next) => {
	ctx.body = 'Hello World'
}).get('/start', (ctx, next) => {
	ctx.body = 'OK'

	client.set('number', Math.floor(Math.random() * 100))
}).get('/:number', async (ctx, next) => {
	const clientNum = Number(ctx.params.number)
	console.log(`clientNum: ${clientNum}`)

	// getCtx = ctx

	await next()

	console.log(`serverNum: ${ctx.serverNum}`)
	const serverNum = Number(ctx.serverNum)


	if (serverNum === null) {
		ctx.body = '<h1 style="text-align: center">please enter /start first</h1>'
	} else if (serverNum === undefined) {
		ctx.body = '<h1 style="text-align: center">please shutdown Redis and relaunch it</h1>'
	} else if (clientNum < serverNum) {
		ctx.body = 'smaller'
	} else if (clientNum > serverNum) {
		ctx.body = 'bigger'
	} else if (clientNum === serverNum) {
		ctx.body = 'equal'
	}
})


app
	.use(router.routes())
	.use(router.allowedMethods())
	.use(async (ctx) => {
		async function getNumber() {
			const serverNum = await getAsync('number')
			ctx.serverNum = serverNum
			// console.log('async')
		}

		await getNumber()
		// console.log(`judge ${ctx === getCtx}`)
	})
	.listen(3000)
