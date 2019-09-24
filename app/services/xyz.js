/**
 * @Author: Abass
 * @Date: 20|09|2019
 * @Objective: building to scale
 */

const config = require('../config/settings');
const utility = require('../lib/utils');
const registerModel = require('../models/register');
const userDashboard = require('../models/user');
const MongoDBHelper = require('./mongoHelper');

class Xyz {
  /**
     *
     * @param {*} logger
     * @param {*} mongoClient
     */
  constructor(logger, mongoClient) {
    this.logger = logger;
    this.mongoClient = new MongoDBHelper(mongoClient, registerModel);
    this.mongoClientDashborad = new MongoDBHelper(mongoClient, userDashboard);
  }

  getAllUser() {
    return this.mongoClient.getBulk();
  }

  saveUser(data) {
    this.logger.info('IN-COMING DATA', data);
    return this.mongoClient.save(data);
  }

  saveUserProfile(data) {
    this.logger.info('IN-COMING DATA', data);
    return this.mongoClientDashborad.save(data);
  }

  getUser(param) {
    this.logger.info('IN-COMING PARAM', param);
    return this.mongoClient.get(param);
  }

  getProfile(param) {
    this.logger.info('IN-COMING PARAM', param);
    return this.mongoClientDashborad.get(param);
  }

  updateProfile(param, data) {
    this.logger.info('IN-COMING PARAM', param);
    return this.mongoClientDashborad.update(param, data);
  }
  
  getUserProfile(param) {
    this.logger.info('IN-COMING PARAM', param);
    return this.mongoClientDashborad.get(param);
  }
}

module.exports = Xyz;