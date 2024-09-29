import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from "express-list-endpoints";
import {createServer} from "http";
import auth from "./routes/auth.ts";
import {type DisconnectReason, Server} from "socket.io";
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
let io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

io.on('connection', async (socket) => {
    const socketId = socket.id;
    console.log(`Socket ${socketId} connected`);

    socket.on('identify', async (data) => {
        const {token} = data;
        const tokenData = await prisma.token.findUnique({
            where: {
                token: token
            }
        });


        if (!tokenData) {
            // return socket.disconnect();
            return
        }

        // update user online status
        await prisma.user.update({
            where: {
                id: tokenData.userId
            },
            data: {
                status: 'online'
            }
        });
        // create socket
        const socketData = await prisma.socket.findMany({
            where: {
                socketId: socketId
            }
        });

        if (socketData.length === 0) {
            await prisma.socket.create({
                data: {
                    socketId: socketId,
                    userId: tokenData.userId
                }
            });
            console.log('socket created');
        }

        // socket.emit('identified', {username: tokenData.user.username});
    });

    socket.on('message', async (data) => {
        console.log('message', data);
    });
    socket.on('disconnect', async (socket: DisconnectReason) => {
        console.log(`Socket ${socketId} disconnected`);
        const socketData = await prisma.socket.findFirst({
            include:{
              user: true
            },
            where: {
                socketId: socketId
            }
        });

        console.table(socketData);
        if (!socketData) {
            return;
        }

       await prisma.user.update({
            where: {
                id: socketData.userId
            },
            data: {
                status: 'offline'
            }
        });

       const sockets = await prisma.socket.findMany({
           where:{
                userId: socketData.userId
           }
       });
       sockets.forEach((s) => {
           prisma.socket.delete({
               where:{
                   id: s.id
               }
           }).then(() => {
                // console.log('socket deleted', s.id);
           });
       });
    });
});

app.use((req: any, res: any, next) => {
    req.io = io;
    next();
});


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Basic route
app.get('/', (req, res) => {
    return res.json({message: 'Server is running'});
});

app.use('/api/auth', auth);

app.get('/test/:userId', async (req:any, res:any) => {
    const {userId} = req.params;
    console.log('socketId', userId);

    const socketData = await prisma.socket.findMany({
        where: {
            userId: typeof userId === 'string' ? parseInt(userId) : userId
        }
    });
    await prisma.socket.findMany({
        where: {
            userId: typeof userId === 'string' ? parseInt(userId) : userId
        }
    });
    console.log('socketData', socketData);
    return res.json(socketData);
});

// List all routes
console.table(routes(app));
// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});