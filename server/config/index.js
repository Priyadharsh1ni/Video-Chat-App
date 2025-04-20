const { Server, Socket } = require('socket.io');
const { SocketUsers } = require('../helper/socketHelper');



// 🧠 Initialize Socket.IO here

const SocketConnection = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
        path: '/socket.io',
        pingInterval: 60000,
        pingTimeout: 5000,
    });


io.on('connection', (socket) => {

    socket.on('join_call', (data) => {
        const updatedUsers = SocketUsers.addUser({ uid: data.uid, name: data.name, channelName: data.channelName });
        socket.join(data.channelName);
        io.emit('joined_users', updatedUsers);
    })

    socket.on('screen_shared', (data) => {
        const updatedUsers = SocketUsers.updateUser(data.uid, { screenShared: data.status });
        const users = SocketUsers.getUsers({ channelName: data.channelName });
        io.emit('screen_share', { uid: data.uid, screenShared: data.screenShared });
    }
    );

    socket.on('screen_shared_stop', (data) =>{
        const updatedUsers = SocketUsers.updateUser(data.uid, { screenShared: data.status });
        const users = SocketUsers.getUsers({ channelName: data.channelName });
        io.emit('screen_share_stopped', { uid: data.uid, screenShared: data.screenShared });
    })
});

}

module.exports = { SocketConnection }