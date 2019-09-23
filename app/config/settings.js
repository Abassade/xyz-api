const appName = 'xyz-api';

const config = {
  appName,
  port: process.env.PORT || 3000,
  host: '127.0.0.1',
  outputDir: `${__dirname.replace('app/config', 'logs')}/`,
  mongo: {
    connection: {
      host: process.env.MONGODB_HOST,
      username: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT,
      dbProd: process.env.MONGODB_DATABASE_NAME,
    },
    collections: {
      register: process.env.REGISTER_COLLECTION,
      userProfile: process.env.PROFILE_COLLECTION
    },
    queryLimit: process.env.MONGODB_QUERY_LIMIT,
    questionLimit: process.env.QUESTION_LIMIT,
  },
};
module.exports = config;