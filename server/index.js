const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const DB = require ('./config/dbconnect')
const {scheduleJobs} = require('./utils/scheduleJob');
const app = express();
const PORT = process.env.PORT || 5000;

const userRoutes = require('./routes/userRoutes')

app.use(cors(
  {
    origin:process.env.CLIENT_URL,
    methods:"*"
  }
));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

//Database Connection
DB();
//ScheduleJobs
scheduleJobs();
//Port Connection
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//Routes usage
app.use("/api/users", userRoutes);