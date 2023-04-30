const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage });

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

  app.post("/api/auth/signin", controller.signin);
};
