const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv').config({ path: "./api/config/.env" })
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser())
// app.use(express.json());

// app.set('views', __dirname + '/api/views/');
// app.set('view engine', 'pug');


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useFindAndModify: false
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
//     return res.status(200).json({
//       message: "it works"
//     });
//   }
//   next();
// });

const authRoutes = require("./api/routes/api");

app.use("/api", authRoutes);
// app.use("/uploads", express.static('uploads'));
// app.use("/uploadImage", express.static('uploadImage'));
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;