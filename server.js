const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http').Server(app);

let server = app.listen(process.env.PORT, () => {
    console.log("server is running on port", server.address().port);
});

const io = require('socket.io').listen(server);

const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let Message = mongoose.model('Message', {name: String, message: String});

let dbUrl = `mongodb+srv://sidharrth2002:${process.env.DBPASSWORD}@chatapp.cts1i.mongodb.net/chatapp?retryWrites=true&w=majority`;

io.on('connection', (socket) => {
    socket.on('connection', () => {
        console.log('a user is connected');
    }); 
    socket.on('typing', () => {
        console.log('someone is typing');
    })
})

// io.on('typing', () => {
//     console.log('someone is typing');
// })

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    let message = new Message(req.body);
    message.save((err)=>{
        if(err) {
            sendStatus(500);
        } 
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

mongoose.connect(dbUrl, {useMongoClient:true, useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    console.log('mongodb connected', err);
})
