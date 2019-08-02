import routes from './routes';
import express from 'express';
import async from 'async';
import mongoose from 'mongoose';

let app;
let server;


function initializeDatabase(callback) {
  mongoose.Promise = global.Promise;
  let connectionString = 'mongodb://';
  connectionString += 'mongo:27017/kyllianapp';
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
  });
  mongoose.connection.once('open', (err) => {
    if (err) {
      console.log('mongo error', err);
      return callback(err);
    }
    console.log("---- DATABASE CONNECTED ----");
    return callback();
  });
}


function initializeExpress(callback) {
  app = express();
  app.use(routes);
  app.use((err, req, res, next) => {
    console.log(err);
    return next(err);
  });
  return callback();
}
function startListening(callback) {
  server = app.listen(process.env.PORT, () => {
    console.log(`Express server listening on port ${server.address().port}`);
    return callback();
  });
}
function startservices() {
  async.series([
    initializeDatabase,
    initializeExpress,
    startListening,
  ], (err) => {
    if (err) {
      console.error(`Error occured ${err}`);
      process.exit(1);
    }
  });
}

function start() {
  startservices();
  console.log('Starting...');
}

export default {
  start,
};
