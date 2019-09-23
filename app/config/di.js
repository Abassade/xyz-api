/**
 * Created by Abass Makinde on 11/03/2019.
 */
const winston = require('winston');
const morgan = require('morgan');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const config = require('../config/settings');
const serviceLocator = require('../lib/serviceLocator');

const XYZService = require('../services/xyz');
const XYZController = require('../controllers/xyz');
/**
 * Returns an instance of logger for the App
 */
serviceLocator.register('logger', () => {
  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });
  const transports = [consoleTransport];
  return winston.createLogger({
    transports,
  });
});

/**
 * Returns an instance of HTTP requests logger
 */
serviceLocator.register('requestlogger', () => morgan('common'));

// mongo instance
serviceLocator.register('mongo', (servicelocator) => {
    const logger = servicelocator.get('logger');
    const connectionString = (!config.mongo.connection.username || !config.mongo.connection.password)
      ? `mongodb://${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`
      : `mongodb://${config.mongo.connection.username}:${config.mongo.connection.password}`
        + `@${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`;
    mongoose.Promise = bluebird;
    const mongo = mongoose.connect(connectionString,{ useNewUrlParser: true })
      .then(() => {
        logger.info('Mongo Connection Established');
      }).catch((err) => {
        logger.error(`Mongo Connection Error : ${err}`);
      });
  
    return mongo;
  });

// Servive instance
serviceLocator.register('XYZService', () => {
  const logger = serviceLocator.get('logger');
  const mongoClient = serviceLocator.get('mongo');
  return new XYZService(logger, mongoClient);
});

// Controller instance
serviceLocator.register('XYZController', (serviceLocator) => {
  const logger = serviceLocator.get('logger');
  const service = serviceLocator.get('XYZService');
  return new XYZController(logger, service);
});

module.exports = serviceLocator;