const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync().then(() => {
  console.log("Database Synched");
});

// routes
require("./routes/auth.routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
