const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('express-async-errors');

// --

const routes = require('./routes');

// -- 

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
//general midware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction){
    app.use(cors());
}

app.use(  
    helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
  );

app.use(
    csurf({
        cookie: {
          secure: isProduction,
          sameSite: isProduction && "Lax",
          httpOnly: true
        }
      })
);

//route middleware

app.use(routes)

//error middleware

module.exports = app; 

//42:11