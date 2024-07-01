const express = require('express');
const mongoose = require('mongoose');
 const cors = require('cors');
const dotenv = require('dotenv')
const session = require('express-session');
const authRouter = require('./Routes/authRoutes');
const connectDb = require('./Config/db');
const passport = require('passport');
const passportSetup = require('./Middleware/passport');
const cookieParser = require ('cookie-parser');
//const bodyParser =require ('body-parser');
const morgan = require('morgan');

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
//app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: true }));
passportSetup(passport) //

app.use(session({
  secret: 'secret',//
  resave: false,
  saveUninitialized: false
}));

app.use(morgan('dev')); // Add logging

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((err,req,res,next)=>{
  const errorStatus =err.status || 500;
  const errorMessage = err.message || "Something went Wrong"
  return res.status(errorStatus).json({
      success:false,
      status:errorStatus,
      message:errorMessage, 
      stack:err.stack
  })
})

// Routes
app.use(cookieParser())
app.use('/auth', authRouter);

// const PORT = process.env.PORT || 8000;
app.listen(8001, () => {
  connectDb()
  console.log(`Server running on port 8001`)
});
