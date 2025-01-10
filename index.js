const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");
const session = require("express-session");
const connectDB = require('./config/db');
config();

const app = express();
app.use(express.json());

connectDB();
const secret = process.env.SECRETKEY

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRoute);

const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, () => {
  console.log(`http://${HOST}:${PORT}`);
});
