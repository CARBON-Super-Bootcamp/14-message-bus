const { createServer } = require('http');
const { stdout } = require('process');

const routers = require('./routers')

function run(){
    const server = createServer((req, res) => {
      routers(req, res);
    });
    
    const PORT = 1234;
    server.listen(PORT, () => {
      stdout.write(`🛰 server performance listening on port ${PORT}\n`);
    });
}

function stop() {
    if (server) {
        server.close()
    }
}

module.exports = {run,stop}
