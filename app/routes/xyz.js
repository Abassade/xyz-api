const config = require('../config/settings');
const auth = require('../midlleware/auth');

const routes = function routes(server, serviceLocator) {
  const XYZController = serviceLocator.get('XYZController');

  server.get({
    path: '/',
    name: 'home',
    version: '1.0.0',
  }, (req, res) => res.send(`Welcome to ${config.appName} API`));

  server.post({
    path: '/register',
    name: 'register a user',
    version: '1.0.0',
  }, (req, res) => XYZController.registerUser(req, res));

  server.post({
    path: '/login',
    name: 'login a user',
    version: '1.0.0',
  }, (req, res) => XYZController.LoginUser(req, res));

  server.get({
    path: '/all-users',
    name: 'get all registered users',
    version: '1.0.0',
  }, auth, (req, res) => XYZController.getAllUsers(req, res));
};

module.exports.setup = routes;