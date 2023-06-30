const express = require('express');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Chat = require("./models/chat");
const User = require("./models/user");

connectDB();
const app = express();


app.use(express.json());

app.get("/", (req, res) => {
    res.send("hi this os a chatroom without front end")
});



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const server = app.listen(3000, () => {
    console.log("server up and running");
});

const io = require("socket.io")(8000);
const users = {};

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('new-user-joined', (name, username) => {
        // Name is the users name
        // username is the unique username
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send-message', (message, username) => {
        try {
            // USER can send message only if the user exists
            User.findOne({ username }, (err) => {
                if (err) {
                    // Then we dont broadcast the message
                    // We can handle it in frontend such that only the logged in user can find the message

                    return;
                }

                // save the chat in the db and then emit it.
                let newChat = new Chat({
                    username,
                    message
                });

                newChat.save(() => {
                    // once the message is saved in db
                    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
                })
            })
        } catch (error) {
            console.error(error);
        }
    })
    socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

