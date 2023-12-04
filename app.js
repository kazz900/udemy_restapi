const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

// multer configurations
const multer = require('multer');

const { v4: uuidv4 } = require('uuid');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
};

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>

app.use(bodyParser.json()); // application/json
// multer
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images'))); // serving image statically

// we need to set headers to allow different domains to send data
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose.connect(
    'mongodb+srv://root:root@cluster0.19xed2k.mongodb.net/messages?retryWrites=true&w=majority'
    ).then(result => {
        console.log('Server starts at port 8080...');
        const server = app.listen(8080);
        // socket.io set-up websocket connection
        const io = require('./socket').init(server);
        io.on('connection', socket => {
            console.log('Client connected');
        });
    }).catch(err => console.log(err));
