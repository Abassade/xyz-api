/**
 * @Author: Abass
 * @Date: 20|09|2019
 * @Objective: building to scale
 */

const mongoose = require('mongoose');
const settings = require('../config/settings');

const mongoCollection = settings.mongo.collections.register;

const xyzSchema = new mongoose.Schema({
  firstname: {
    required: true,
    type: String,
  },
  lastname: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    type: String,
    minlength: 5
  },
  cPassword: {
    type: String,
    minlength: 5
  },
  country: {
    required: true,
    type: String,
  },
  number: {
    required: true,
    type: String,
  },
  sponsorID: {
    type: String,
  },

},
{
  timestamps: true,
});

module.exports = mongoose.model(mongoCollection, xyzSchema);