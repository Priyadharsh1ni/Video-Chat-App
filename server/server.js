const express = require('express');
const app = express();
const cors = require('cors');
const router  = require('./router/index');
const  {SocketConnection}  = require('./config/index');
const http = require('http');

let server = http.createServer(app);
// Middleware
app.use(cors());
app.use(express.json());
app.use('/', router);

SocketConnection(server)
// Start Server
server.listen(8000, () => {
    console.log('🚀 Server is running on port 8000');
});
