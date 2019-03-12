const http = require('http')

http.createServer((request, response) => {
	response.writeHead(200, {
		'Content-Type': 'text/html',
	})
	response.write('<h1 style="text-align: center">Hello World</h1>')
	response.end()
}).listen(3000)
