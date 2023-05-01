const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
var multer = require("multer");
var path = require("path");

// Multer Storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

// Routes
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    upload.single("photo"),
    [verifySignUp.checkDuplicatePhone],
    controller.signup
  );
  app.patch(
    "/api/auth/updateUser",
    upload.single("photo"),
    controller.updateUser
  );
  app.delete("/api/auth/deleteUser", controller.deleteUser);
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/logout", controller.logout);
};
