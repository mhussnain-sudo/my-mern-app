// C:\Users\HP\Downloads\Hussnain\my-mern-app\server\config\dbconnect.js

const mongoose = require('mongoose');

function DB() {
  // Database connection logic
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));


}

module.exports = DB;
