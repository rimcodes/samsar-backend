const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cors = require('cors')
require('dotenv/config');

//Implementation of CORS
app.use(cors());
app.options('*', cors())

//Midleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads/images', express.static(__dirname + '/public/uploads/images'));
app.use('/', express.static(__dirname + '/dist'));
app.use(errorHandler);

//Routes for different api endpoints
const usersRouter = require('./routers/users');
const propertiesRouter = require('./routers/properties');
const mogatasRouter = require('./routers/mogatas');
const wilayasRouter = require('./routers/wilayas');
const categoriesRouter = require('./routers/categories');
const postsRouter = require('./routers/posts');
const topicsRouter = require('./routers/topics');
const commentRouter = require('./routers/comments');
const demandRouter = require('./routers/demands');

const api = '/api/v1';// should get it from .env

app.use(`${api}/users`, usersRouter);
app.use(`${api}/properties`, propertiesRouter);
app.use(`${api}/wilayas`, wilayasRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/mogatas`, mogatasRouter);
app.use(`${api}/posts`, postsRouter);
app.use(`${api}/topics`, topicsRouter);
app.use(`${api}/comment`, commentRouter);
app.use(`${api}/demand`, demandRouter);


connString = process.env.CONN || '';

mongoose.connect(connString)
.then( () => {
    console.log('connection is ready!');    
})
.catch((err) => {
    console.log(err);
});

basePath = ''

port = process.env.PORT || 5000;
app.listen( port, () => {
    console.log(`Server is running on ${basePath}:${port} ...`);
});