import express from 'express';
import http from 'http';
import {Server as socketserver} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketserver(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

io.on('connection', async (socket) => {
    const id = socket.id;
    console.log('A user connected');

    

    socket.on('message', (msj) => {

        socket.broadcast.emit('message', {
            body: msj.body,
            from: msj.user,
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});


server.listen(5172, () => {
    console.log('Server is running on http://localhost:5172');
});