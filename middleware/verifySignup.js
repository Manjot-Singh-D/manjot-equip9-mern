const db = require("../models");
const User = db.user;

// Check if there are no duplicate phone numbers
checkDuplicatePhone = (req, res, next) => {
  User.findOne({
    where: {
      phone: req.body.phone,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! phone is already in use!",
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicatePhone: checkDuplicatePhone,
};

module.exports = verifySignUp;
