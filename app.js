const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const http = require('http');
const predictRouter = require('./routes/predict');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      port : 5432,
      password : '1234',
      database : 'brain'
    }
  });

knex.select('*').from('users').then( data => {
    console.log(data);
})

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: '12345',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: '12345',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '122',
            hash: '',
            email: 'Sally@gmail.com'
        }
    ]
}
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

app.post('/signin', (req, res) => {
    bcrypt.compare(req.body.password, database.users[2].password, function(err, result) {
        if (result && req.body.email === database.users[2].email) {
            let cloneUser = { ...database.users[2]};
            delete cloneUser.password;
            res.json(cloneUser);
        } else {
            res.status(400).json('error logging in')
        }
    });
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if( err ) {
            res.json("error while hashing");       
        } else {
            database.users.push({
                id: '125',
                name: name,
                email: email,
                password: hash,
                entries: 0,
                joined: new Date()
            })
            let cloneUser = { ...database.users[database.users.length - 1] };
            delete cloneUser.password;
            res.json(cloneUser);
        }
    });
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id) {  
            return res.json(user);
        } 
    })
    res.status(404).json('no such user'); 
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    database.users.forEach(user => {
        if (user.id === id) {  
            user.entries++;
            return res.json({entry: user.entries});
        } 
    })
    res.status(404).json('no such user'); 
})

app.use('/predict', predictRouter);
app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, "build", "index.html"));
})
const port = process.env.PORT || '8080';

app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
    console.log('Listening on ' + (port));
});