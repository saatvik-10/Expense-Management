const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/connectDB');

//config dotenv
dotenv.config();

// database call
connectDB();

// rest obj
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// routes
app.use('/api/v1/users', require('./routes/userRoute'));

// port
const PORT = 8080 || process.env.PORT;

// listen
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`.bgCyan.white);
});
