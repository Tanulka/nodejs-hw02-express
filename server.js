const app = require('./app');

require('dotenv').config();
const mongoose = require('mongoose');
const { DB_HOST, PORT = 3000 } = process.env;
// const DB_HOST =
//   'mongodb+srv://Tanya:vSbMPfSIrIyu4xPU@cluster0.ljkxz.mongodb.net/db-contacts?retryWrites=true&w=majority';
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
