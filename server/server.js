require('dotenv').config();
const express = require('express'),
      app = express(),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      csrf = require('csurf'),
      helmet = require('helmet'),
      books = require('./src/books'),
      secure = require('./src/secure'),
      user = require('./src/user');

let csrfProtection = csrf({ cookie: true });

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(csrfProtection);
app.use('/books', books); // adding books routes
app.use('/secure', secure); // adding secure routes
app.use('/user', user); // adding user routes

app.listen(3001, () => {
    console.log('server started');
});