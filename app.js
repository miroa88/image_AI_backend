const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const http = require('http');
const predictRouter = require('./routes/predict');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('knex');
const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      port : 5432,
      password : '1234',
      database : 'brain'
    }
  });

const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
// We added bodyParser so that we can access `body` in `req` later
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.use('/predict', predictRouter);
app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, "build", "index.html"));
    res.json("everything is up and running")
})

const port = process.env.PORT || '8080';

app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
    console.log('Listening on ' + (port));
});