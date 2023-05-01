const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { uploadFile } = require("./s3.controller");

// Signup
exports.signup = async (req, res) => {
  try {
    uploadFile(req.file)
      .then(async (data) => {
        await db.sequelize
          .query(`CALL createUser(?,?,?,?,?,?,?)`, {
            replacements: [
              req.body.firstName,
              req.body.lastName,
              data.Location,
              req.body.phone,
              bcrypt.hashSync(req.body.password, 8),
              req.body.firstName + " " + req.body.lastName,
              req.body.firstName + " " + req.body.lastName,
            ],
          })
          .then((user) => {
            unlinkFile(req.file.path);
            res.send({ message: "User registered successfully!" });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(404).send({ message: "Server Error" });
  }
};
// UpdateUser
exports.updateUser = async (req, res) => {
  try {
    let { firstName, lastName, id } = req.body;
    let userId = parseInt(id);

    if (req.file) {
      uploadFile(req.file)
        .then(async (data) => {
          const newPhoto = data.Location;
          await db.sequelize
            .query(`CALL updateUser(?,?,?,?)`, {
              replacements: [userId, firstName, lastName, newPhoto],
            })
            .then(async (result) => {
              unlinkFile(req.file.path);
              const data = {
                id: userId,
                firstName: firstName,
                lastName: lastName,
                photo: newPhoto,
              };
              return res.status(200).json({
                message: "User updated successfully-withPhoto",
                data: data,
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: "Server error" });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await db.sequelize
        .query(`CALL updateUser(?,?,?,?)`, {
          replacements: [userId, firstName, lastName, null],
        })
        .then(async (result) => {
          return res.status(200).json({
            message: "User updated successfully-withoutPhoto",
            data: {
              id: userId,
              firstName: firstName,
              lastName: lastName,
            },
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Server error" });
        });
    }
  } catch (err) {
    res.status(404).send({ message: "Server Error" });
  }
};

// DeleteUser
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.query["userId"];

    await db.sequelize
      .query(`CALL deleteUser(?)`, { replacements: [userId] })
      .then(async (result) => {
        await res.clearCookie("access_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        res.status(204).send({ message: "User Deleted!" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout User
exports.logout = async (req, res) => {
  try {
    const userId = req.body.uid;

    await db.sequelize
      .query(`CALL findUserById(?)`, { replacements: [userId] })
      .then(async (result) => {
        const user = result[0];
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        await res.clearCookie("access_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        res.status(204).send({ message: "User logged Out" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Signin user
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
          message: "Logged in successfully",
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
