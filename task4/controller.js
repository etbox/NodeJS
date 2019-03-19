const fs = require('fs')
const router = require('koa-router')()


// add url-route in /controllers:

function addMapping(router, mapping) {
	for (const url in mapping) {
		let path
		if (url.startsWith('GET ')) {
			path = url.substring(4)
			router.get(path, mapping[url])
			console.log(`register URL mapping: GET ${path}`)
		} else if (url.startsWith('POST ')) {
			path = url.substring(5)
			router.post(path, mapping[url])
			console.log(`register URL mapping: POST ${path}`)
		} else if (url.startsWith('PUT ')) {
			path = url.substring(4)
			router.put(path, mapping[url])
			console.log(`register URL mapping: PUT ${path}`)
		} else if (url.startsWith('DELETE ')) {
			path = url.substring(7)
			router.del(path, mapping[url])
			console.log(`register URL mapping: DELETE ${path}`)
		} else {
			console.log(`invalid URL: ${url}`)
		}
	}
}

function addControllers(router, dir) {
	fs.readdirSync(`${__dirname}/${dir}`).filter(f => f.endsWith('.js')).forEach((f) => {
		console.log(`process controller: ${f}...`)
		const mapping = require(`${__dirname}/${dir}/${f}`)
		addMapping(router, mapping)
	})
}

module.exports = (dir) => {
	const controllersDir = dir || 'controllers'
	addControllers(router, controllersDir)
	return router.routes()
}
