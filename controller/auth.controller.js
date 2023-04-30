const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { uploadFile, getFileStream } = require("./s3.controller");

exports.signup = async (req, res) => {
  // Save User to Database
  console.log(req.file);
  try {
    uploadFile(req.file)
      .then((data) => {
        User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          photo: data.Location,
          phone: req.body.phone,
          password: bcrypt.hashSync(req.body.password, 8),
          created_by: req.body.firstName + " " + req.body.lastName,
          updated_by: req.body.firstName + " " + req.body.lastName,
        })
          .then((user) => {
            res.send({ message: "User registered successfully!" });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
        unlinkFile(req.file.path);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(404).send({ message: "Server Error" });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      phone: req.body.phone,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({
          message: "Logged in successfully 😊 👌",
          data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            photo: user.photo,
          },
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
