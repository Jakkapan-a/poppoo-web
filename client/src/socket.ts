import {io, Socket} from 'socket.io-client';

const URL = 'http://localhost:3000';

const socket: Socket = io(URL,{
    autoConnect: true,
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;