import { io } from 'socket.io-client';
import { Socketv2 } from '../config/socketConfig';

// Initialize the socket instance
const socket = io('http://localhost:8000', {
    transports: ['websocket'],
    autoConnect: false,
});


export const initiateSocket = (Event) => {
    if (!socket.connected) {
        socket.connect();
    }

    socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server with ID:', socket.id);
    });

    socket.on('joined_users', (data) => {
        Event('joined_users', data)
    });

    socket.on('get_joined_users', (data) => {
        Event('get_joined_users', data);
    });
    
    socket.on("screen_share", (data) => {
        console.log("🚀 ~ screen_shared ~ data:", data)
        Event('screen_share', data);
    });

    socket.on("screen_share_stopped", (data) => {
        console.log("🚀 ~ screen_shared ~ data:", data)
        Event('screen_share_stopped', data);
    });
    socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
    });
};


export const joinCall = (data) =>{
    console.log("🚀 ~ joinCall ~ data:", data)
    return socket.emit("join_call", data);
}

export const getUsers = (data) =>{
    return socket.emit("get_users", data);
}

export const leaveCall = (data) =>{
    return socket.emit("leave", data);
}

export const screenShared = (data) =>{
    return socket.emit("screen_shared", data);
}

export const screenSharedStop = (data) =>{
    return socket.emit("screen_shared_stop", data);
}
// Optionally export socket instance for emitting events
export { socket };
