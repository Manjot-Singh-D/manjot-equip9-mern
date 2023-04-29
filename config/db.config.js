module.exports = {
  HOST: "userdb.cf6voriehqpd.us-east-2.rds.amazonaws.com",
  port: "3306",
  USER: "admin",
  PASSWORD: "1234567890",
  DB: "userdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
