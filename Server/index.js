const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const userRoutes = require('./routes/users.-routes/users');
const quizRoutes = require('./routes/quizzes-routes/quizzes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;
let server;

// middlware config

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(bodyParser.json({ limit: '20mb' }));

//defining the routes

app.use('/api/users/', userRoutes);
app.use('/api/quizzes/', quizRoutes);

mongoose.connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex:true,
        useFindAndModify:false
    }).then(() => console.log('Database connection established'))
    .catch(er => console.log('Error connecting to mongodb instance: ', er));

server = app.listen(PORT, () => {
    console.log(`Node server running on port: ${PORT}`);
});
