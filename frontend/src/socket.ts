import {io, Socket} from 'socket.io-client';

const host = window.location.host;

// export const SERVER_URL = `http://${host}`;
export const SERVER_URL = `http://13.250.123.133:3000`;

const socket: Socket = io(SERVER_URL,{
    autoConnect: false,
    
});

// socket.onAny((event, ...args) => {
//     console.log(event, args);
// });

interface TopScore {
    username: string,
    score: number,
    status:string,
    updatedAt: string
}

export default socket;