import express, {json} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from "express-list-endpoints";
import {createServer} from "http";
import auth from "./routes/auth.ts";
import {type DisconnectReason, Server} from "socket.io";
import {PrismaClient} from '@prisma/client';
import pop from "./routes/pop.ts";
import { popMiddleware } from "./middlewares/pop.ts";
import {addScore, broadcastScore, popTopScore} from "./controllers/pop.ts";

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
    socket.emit('getTopScores', true);
    socket.on('addScore', async (data) => {
        const {userId, score} = data;
        console.log("add score");
        const currentScore =  await addScore(userId, score);
        const score_ = {
            userId,
            score: currentScore
        }
        console.log('Add score socketId:', socketId);
        await broadcastScore(socket, socketId);
        socket.emit('updateScore', score_);
    });
    socket.on('identify', async (data) => {
        const {token} = data;
        const tokenData = await prisma.token.findFirst({
            where: {
                token: token
            }
        });
        if (tokenData === null) {
            console.log('Token not found');
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
        const existingSocket = await prisma.socket.findFirst({
            where: { socketId: socketId }
        });

        if (!existingSocket) {
            // create socket if not exists
            try{
                await prisma.socket.create({
                    data: {
                        socketId: socketId,
                        userId: tokenData.userId
                    }
                });
            }catch (e:any) {
                console.error(e.message);
            }
        } else {
            console.log('Socket already exists:', socketId);
        }
        await broadcastScore(socket);
        // socket.emit('identified', {username: tokenData.user.username});
    });
    socket.on('message', async (data) => {
        console.log('message', data);
    });
    socket.on('sign-out', async (data) => {
        const {username} = data;
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
        console.log('sign-out', user);
        if (!user) {
            return;
        }
        const dataemit = {
            username: user.username,
            id: user.id
        }
        socket.broadcast.emit('sign-out-broadcast', dataemit);
        await broadcastScore(socket);
    });
    socket.on('sign-out-btn', async (data) => {
        try {
            const {username, id} = JSON.parse(data);
            console.log('sign-out-btn', data);
            const user = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });

            if (!user) {
                return;
            }
            // update user status
            await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    status: 'offline'
                }
            });

            // delete socket
            const sockets = await prisma.socket.findMany({
                where: {
                    userId: id
                }
            });
            sockets.forEach((s) => {
                prisma.socket.delete({
                    where: {
                        id: s.id
                    }
                }).then(() => {
                    // console.log('socket deleted', s.id);
                });
            });

            // delete token
            const tokens = await prisma.token.findMany({
                where: {
                    userId: id
                }
            });
            tokens.forEach((t) => {
                prisma.token.delete({
                    where: {
                        id: t.id
                    }
                }).then(() => {
                    // console.log('token deleted', t.id);
                });
            });
            // console.log('tokens', tokens);
            const topscore = await broadcastScore(socket);
            socket.emit('topScore', topscore);
        }catch (e:any) {
            console.error(e.message);
        }
    });
    socket.on('signed-in', async (data) => {
        console.log('signed-in', data);
        const topscore = await broadcastScore(socket);
        console.table(topscore);
        // socket.emit('topScore', topscore);
    });
    socket.on('update-score', async (data) => {
        await broadcastScore(socket);
    });
    socket.on('disconnect', async (_socket: DisconnectReason) => {
        console.log(`Socket ${socketId} disconnected`);
        try {
            const socketData = await prisma.socket.findFirst({
                include:{
                    user: true
                },
                where: {
                    socketId: socketId
                }
            });

            if (!socketData) {
                console.log('Socket data not found');
                return;
            }
            console.log('User update status to offline', socketData.userId);

            await prisma.user.update({
                where: {
                    id: socketData.userId
                },
                data: {
                    status: 'offline'
                }
            });
            console.log('user status updated',  socketData.userId);
           const sockets = await prisma.socket.findMany({
               where:{
                    userId: socketData.userId
               }
           });
            try {
                for (const s of sockets) {
                    try {
                        await prisma.socket.delete({
                            where: {
                                id: s.id
                            }
                        });
                        console.log('socket deleted', s.id);
                    } catch (e: any) {
                        console.error('Error deleting socket:', e.message);
                    }
                }
            } catch (e: any) {
                console.error(e.message);
            }

            await broadcastScore(socket);
        }catch (e:any) {
            console.error(e.message);
        }


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

app.get('/', (req, res) => {
    return res.json({message: 'Server is running'});
});
app.get('/api', (req, res) => {
    return res.json({message: 'Server is running'});
});

app.use('/api/auth', auth);
app.get('/api/top-score', async (req:any, res:any) => await popTopScore(req, res));
app.use('/api/pop',popMiddleware,pop)

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