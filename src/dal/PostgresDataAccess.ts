const config = require('../../config/config');

const pgp = require('pg-promise')({
  // Initialization options...
});

const connString: string = 'postgres://' +
      config.postgres.username + ':' +
      config.postgres.password + '@' +
      config.postgres.host + ':' +
      config.postgres.port + '/' +
      config.postgres.database;

const db = pgp(connString);

export class PostgresDataAccess {

  add = (sql, bindings, res) => {
    db.one(sql, bindings)
      .then((result) => {
        res.status(201)
            .send({
              message: 'Success',
              status: res.status,
              result
            });
      })
      .catch((error) => {
        res.status(500)
          .send({
            message: 'Failed',
            status: res.status,
            error
          });
      });
  }

  update = (sql, bindings, res) => {
    db.one(sql, bindings)
      .then((result) => {
        res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              result
            });
      })
      .catch((error) => {
        res.status(500)
          .send({
            message: 'Failed',
            status: res.status,
            error
          });
      });
  }

  delete = (sql, bindings, res) => {
    db.none(sql, bindings)
      .then(() => {
        res.status(204)
            .send({
              message: 'Success',
              status: res.status
            });
      })
      .catch((error) => {
        res.status(500)
          .send({
            message: 'Failed',
            status: res.status,
            error
          });
      });
  }

  findOne = (sql, bindings, res) => {
    // Run sql query from the database then return the result.
    db.oneOrNone(sql, bindings)
      .then((result) => {
        if (result === null) {
          res.status(404)
            .send({
              message: 'Failed',
              status: res.status,
              result
            });
        } else {
          res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              result
            });
        }
      })
      .catch((error) => {
        res.status(500)
          .send({
            message: 'Failed',
            status: res.status,
            error
          });
      });
  }

  findMany = (sql, bindings, res) => {
    // Run sql query from the database then return the result.
    db.query(sql, bindings)
      .then((result) => {
        if (result.length === 0) {
          res.status(404)
            .send({
              message: 'Success',
              status: res.status,
              result
            });
        } else {
          res.status(200)
            .send({
              message: 'Success',
              status: res.status,
              result
            });
        }
      })
      .catch((error) => {
        res.status(500)
          .send({
            message: 'Failed',
            status: res.status,
            error
          });
      });
  }

}
