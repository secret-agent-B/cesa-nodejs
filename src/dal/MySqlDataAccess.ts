import { Connection } from 'mysql';

const mysql = require('mysql');
const config = require('../../config/config');

export class MySqlDataAccess {

  // connect to the database using the configuration that was supplied.
  private connection: Connection;

  constructor() {
    this.connection = mysql.createConnection(config.mysql);
  }

  queryDb(sql, bindings, res) {
    return new Promise(function (resolve, reject) {
      // Try to establish a connection. Otherwise, send error back.
      this.connection.connect(function (err) {
        if (err) {
          reject(err);
        }
      });

      // Display log.
      console.log('MySQL: Connected as id ' + this.connection.threadId);

      // Query database with sql and bindings that was supplied from the router.
      this.connection.query(sql, bindings, function(error, results, fields) {
        if (error) {
          // Something went wrong, return error.
          reject(error);
        }

        this.connection.end();
        resolve(results);
      });
    });
  }

}
