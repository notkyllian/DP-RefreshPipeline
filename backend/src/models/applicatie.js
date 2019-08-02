import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  key: String,
  refreshurl: String,
  statusurl: String,
  busy: Boolean,
});

module.exports = mongoose.model('App', appSchema);
