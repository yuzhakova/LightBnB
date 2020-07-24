// Connect to db lighbnb
const pg = require('pg');
const Pool = pg.Pool;

const options = {
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: '5432'
}

const pool = new Pool(options);

pool.connect(() => {
  console.log('connected to db!');
});

module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
}