/**
 * @Author: Abass
 * @Date: 20|09|2019
 * @Objective: building to scale
 */

const config = require('../config/settings');

class MongoDBHelper {
  /**
   * The constructor
   *
   * @param mongodbClient - MongoDB client
   * @param mongodbModel - the model you wish to operate on
   */
  constructor(mongodbClient, mongodbModel) {
    this.mongodbClient = mongodbClient;
    this.mongodbModel = mongodbModel;
  }

  /**
   * Fetches a single record from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  get(params) {
    return new Promise((resolve, reject) => {
      const query = this.mongodbModel.findOne(params);

      if (params.fields) { query.select(params.fields); }

      if (params.populate && params.populate.length > 0) {
        params.populate.forEach((collection) => {
          query.populate({ path: collection.path, model: collection.model });
        });
      }

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }

  /**
   * Fetches a single record from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  getSorted(param) {
    return new Promise((resolve, reject) => {
      const query = this.mongodbModel.find({ $query: param, $orderby: { createdAt: -1 } });

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }

  /**
   * Fetches bulk records from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  getBulk(params) {
    return new Promise((resolve, reject) => {
      const parameter = params;
      if (params && !parameter.limit) {
        // force the limit value from the environment variable to Int
        parameter.limit = parseInt(config.mongo.queryLimit.toString(), 10);
      }

      const query = params === undefined ? this.mongodbModel.find()
        : this.mongodbModel.find(parameter.conditions);

      if (params && parameter.fields) {
        query.select(params.fields);
      }
      if (params && parameter.distinct) {
        query.distinct(parameter.distinct);
      } else if (params) {
        query.limit(parameter.limit);
      }

      if (params && parameter.sort) {
        query.sort(parameter.sort);
      }

      if (params && parameter.populate && parameter.populate.length > 0) {
        parameter.populate.forEach((collection) => {
          query.populate({ path: collection.path, model: collection.model });
        });
      }

      return query.select({"password": 0, "cPassword": 0, "__v": 0}).exec((error, modelData) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(modelData);
      });
    });
  }

  /**
   * Saves data into the MongoDB instance
   *
   * @param data
   * @returns {Promise}
   */
  save(data) {
    return new Promise((resolve, reject) => {
      const mongodbSaveSchema = this.mongodbModel(data);
      return mongodbSaveSchema.save((error, result) => {
        if (error != null) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(result);
      });
    });
  }

  /**
   * Updates a SINGLE RECORD in the MongoDB instance's DB based on some conditional criteria
   *
   * @param params - the conditional parameters
   * @param data - the data to update
   * @returns {Promise}
   */
  update(params, data) {
    return new Promise((resolve, reject) => this.mongodbModel.findOneAndUpdate(
      params,
      { $set: data },
      { new: true },
      (error, response) => {
        if (error) {
          if (config.logging.console) {
            return new Error(`Update Error: ${JSON.stringify(error)}`);
          }
          return reject(MongoDBHelper.handleError(error));
        }
        if (error == null && response == null) {
          return reject(new Error("Record Not Found In DB'"));
        }
        return resolve(response);
      },
    ));
  }

  /**
   * Delete MULTIPLE RECORDS from the MongoDB instance's DB based on some conditional criteria
   *
   * @param params - the conditional parameters
   * @returns {Promise}
   */
  deleteBulk(params) {
    return new Promise((resolve, reject) => this.mongodbModel.remove(params.conditions,
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(response);
      }));
  }


  /**
   * This closes the connection from this client to the running MongoDB database
   *
   * @returns {Promise}
   */
  close() {
    return new Promise((resolve, reject) => {
      this.mongodbClient.close();
      return resolve({
        error: false,
        msg: 'connection was successfully closed. Why So Serious, I am gone for a vacation!',
      });
    });
  }


  /**
   * Used to format the error messages returned from the MongoDB server during CRUD operations
   *
   * @param report
   * @returns {{error: boolean, message: *}}
   */
  static handleError(report) {
    return { error: true, msg: report };
  }
}

module.exports = MongoDBHelper;