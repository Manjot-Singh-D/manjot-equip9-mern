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

exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, id } = req.body;
    if (req.file) {
      uploadFile(req.file)
        .then(async (data) => {
          const user = await User.findOne({
            where: {
              id: id,
            },
          });

          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }

          user.firstName = firstName || user.firstName;
          user.lastName = lastName || user.lastName;
          user.photo = data.Location || user.photo;
          user.updated_by = user.firstName + " " + user.lastName;
          user.updated_date = new Date().toUTCString();
          await user.save();
          unlinkFile(req.file.path);
          return res.status(200).json({
            message: "User updated successfully",
            data: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              photo: user.photo,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const user = await User.findOne({
        where: {
          id: id,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.updated_by = user.firstName + " " + user.lastName;
      user.updated_date = new Date().toUTCString();
      await user.save();

      return res.status(200).json({
        message: "User updated successfully",
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    }
  } catch (err) {
    res.status(404).send({ message: "Server Error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.query["userId"];
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete the user from the database
    await user.destroy();

    res.status(204).send({ message: "User Deleted" }); // send a 204 No Content response to indicate success
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.body.uid;
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    // delete the user from the database

    res.status(204).send({ message: "User logged Out" }); // send a 204 No Content response to indicate success
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
