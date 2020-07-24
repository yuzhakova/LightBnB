// const properties = require('./json/properties.json');
// const users = require('./json/users.json');
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'vagrant',
//   password: '123',
//   host: 'localhost',
//   database: 'lightbnb'
// });

// require pool from db
const pool = require('./db/index.js');

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const text = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
  const values = [email.toLowerCase()];

  return pool.query(text, values)
    .then(res => res.rows[0])
    .catch(error => console.error('User Null', error.stack));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const text = `
  SELECT * FROM users
  WHERE id = $1
  `;

  const values = [id];
  return pool.query(text,values)
    .then(res => res.rows[0])
    .catch(error => console.error('User Null', error.stack));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userName = user.name;
  // const userPwd = user.password;
  // const userEmail = user.email;

  // const text = `
  //   INSERT INTO users (name, email, password)
  //   VALUES ($1, $2, $3)
  //   RETURNING *
  // `;

  // const values = [userName, userEmail, userPwd];

  // return pool.query(text, values)
  //   .then(res => res.rows[0])
  //   .catch(err => console.error("Error", err.stack));

  return pool.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *;',[user.name, user.email, user.password])
  .then(res => res.rows[0]);
    /*
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);*/
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const text = `
  SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1 AND end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2
  `;

  const values = [guest_id, limit];
  return pool.query(text, values)
    .then(res => res.rows)
    .catch(err => console.error("Error", err.stack));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    if (queryParams.length >= 2) {
      queryString += `AND cost_per_night > $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night > $${queryParams.length} `;
    }
  }


  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    if (queryParams.length >= 2) {
      queryString += `AND cost_per_night < $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night < $${queryParams.length} `;
    }
  }

  if (options.minimum_rating > 0) {
    queryParams.push(options.minimum_rating);
    if (queryParams.length >= 2) {
      queryString += `AND rating > $${queryParams.length}`;
    } else {
      queryString += `WHERE rating > $${queryParams.length}`;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 6
  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool.query(`
  INSERT INTO properties (
    owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms
    )  
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *;
  `, [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ])
  .then(res => res.rows);
}
exports.addProperty = addProperty;