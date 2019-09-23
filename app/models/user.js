const mongoose = require('mongoose');
const settings = require('../config/settings');

const mongoCollection = settings.mongo.collections.userProfile;

const userProfileSchema = new mongoose.Schema({
  fullname: {
    required: true,
    type: String,
  },
  userCode: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String
  },
  number: {
    type: String
  },
  uniqueUrl: {
    type: String
  },
  dashBoardBalance: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  referralBonus: {
    type: Number,
    default: 0
  },

})

module.exports = mongoose.model(mongoCollection, userProfileSchema);