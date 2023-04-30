const config = require("../config/db.config");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  port: config.port,
  operatorsAliases: false,
  ssl: "Amazon RDS",
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

try {
  db.sequelize.query(`
  CREATE PROCEDURE IF NOT EXISTS deleteUser(IN userId INT)
BEGIN
    DELETE FROM users WHERE id = userId;
END
`);
} catch (err) {}

try {
  db.sequelize.query(`
  CREATE PROCEDURE IF NOT EXISTS findUserById(IN userId INT)
      BEGIN
        SELECT * FROM users WHERE id = userId;
      END
`);
} catch (err) {}

try {
  db.sequelize.query(`
  CREATE PROCEDURE IF NOT EXISTS updateUser(IN userId INT, IN firstName VARCHAR(255), IN lastName VARCHAR(255), IN photo VARCHAR(255))
  BEGIN
    UPDATE users SET 
      firstName = IFNULL(firstName, users.firstName),
      lastName = IFNULL(lastName, users.lastName),
      photo = IFNULL(photo, users.photo),
      updated_by = CONCAT(IFNULL(firstName, users.firstName), ' ', IFNULL(lastName, users.lastName)),
      updated_date = UTC_TIMESTAMP()

    WHERE id = userId;
  END
`);
} catch (err) {}

try {
  db.sequelize.query(`
  CREATE PROCEDURE IF NOT EXISTS createUser(
    IN firstName VARCHAR(255),
    IN lastName VARCHAR(255),
    IN photo VARCHAR(255),
    IN phone VARCHAR(255),
    IN password VARCHAR(255),
    IN created_by VARCHAR(255),
    IN updated_by VARCHAR(255)
  )
  BEGIN
    INSERT INTO users (firstName, lastName, photo, phone, password, created_by, updated_by)
    VALUES (firstName, lastName, photo, phone, password, created_by, updated_by);
  END
  `);
} catch (err) {}

db.user = require("./user.model.js")(sequelize, DataTypes);

module.exports = db;
