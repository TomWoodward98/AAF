require('dotenv').config();
let express = require('express');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');

let bodyParser = require('body-parser');
let cors = require('cors');

const app = express();

//-------------------- Socket ---------------------\\
const server = require("http").createServer();
const io = require('socket.io')(server, { cors: { origin: "*", }, });
const PORT = process.env.SOCKET_PORT;

io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);
    const { roomId } = socket.handshake.query; //Get Room ID based on ticket
    socket.join(roomId);
    io.in(roomId).emit('connected', 'You have been connected successfully');

    // Listen for new messages
    socket.on('chat-message', (data) => {
        socket.broadcast.in(roomId).emit('chatMessage', data); // Send the message data back if message sent
    });

    // Leave the room if the user closes the socket
    socket.on('disconnected', () => {
        console.log(`Client ${socket.id} disconnected`);
        io.in(roomId).emit('disconnected');
        socket.leave(roomId);
    });
});
server.listen(PORT, () => { // If socket server running console log this with the port number
    console.log(`Listening on port ${PORT}`);
});
//--------------------------------------------------\\

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use(cors({
    origin: [
        'http://localhost:' + process.env.FE_PORT,
    ],
    credentials: true,
}));

const db = require('./models');
db.mongoose.connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database!');
    app.listen(process.env.BE_PORT, () => {
        console.log(`Express is running on port ` + process.env.BE_PORT);
    });
}).catch(err => {
    console.log('Cannot connect to the database!', err);
    process.exit();
});

app.use('/', require('./routes/users'));
app.use('/ticket', require('./routes/ticket'));
app.use('/department', require('./routes/department'));
app.use('/chat', require('./routes/chat'));

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});