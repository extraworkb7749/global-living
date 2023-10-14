const mysql = require("mysql2");

let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

// let pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "global-living-db-dev",
//   password: "root",
//   port: 3307,
//   multipleStatements: true,
// });
module.exports = pool.promise();
