import io from 'socket.io-client';

const options = {
    "force new connection": true,
    reconnectionAttemps: "Infinity",
    timeout: 10000,
    transports: ["websocket"]
}

const socket = io('http://localhost:3000', options)

export default socket;