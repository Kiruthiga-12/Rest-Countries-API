const jsonserver = require('json-server');
const server = jsonserver.create();
const router = jsonserver.router('data.json');
const middleware = jsonserver.defaults();
const port = 8080;

server.use(middleware);
server.use(router);

server.listen(port,()=>console.log('Server is listening...'));