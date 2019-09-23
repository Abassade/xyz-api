/* eslint-disable no-undef */
require('dotenv').config();
const restify = require('restify');
const path = require('path');
const restifyPlugins = require('restify').plugins;
const corsMiddleware = require('restify-cors-middleware');
const servicelocator = require('./app/config/di');
const config = require('./app/config/settings');
const registerRoutes = require('./app/routes/xyz');

const logger = servicelocator.get('logger');
const requestLogger = servicelocator.get('requestlogger');

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
});

const server = restify.createServer({
  name: config.appName,
  versions: ['1.0.0'],
});

/**
 * Middleware
 */

server.use(restifyPlugins.bodyParser());
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser());
server.pre(cors.preflight);
server.use(cors.actual);

// setup requests logging
server.use(requestLogger);

// setup Routing for auto
registerRoutes.setup(server, servicelocator);

server.listen(config.port, config.host, () => {
  logger.info(`${server.name} is listening on ${server.url}`);
});

module.exports = server;