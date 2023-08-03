import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/aouthRoutes.mjs";
import db from "./dbConection.mjs";
import session from "express-session";

const app = express();
app.use("/static", express.static("public"));

const setMessageMiddleware = (req, res, next) => {
  res.locals.message = "";
  res.locals.errorEmailMessage = "";
  res.locals.errorUsernameMessage = "";
  res.locals.errorPasswordMessage = "";
  res.locals.errorPasswordMatchMessage = "";
  res.locals.errorField = "";
  res.locals.userRegistered = "";
  res.locals.loginError = "";
  next();
};

app.use(setMessageMiddleware);

// parse json data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define routes
app.use("/", authRoutes);

//set cookieparser and session and flash
app.use(cookieParser("secretStringForCookie"));
app.use(
  session({
    secret: "secretStringForCookie",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

// view engine setup
app.set("view engine ", "ejs");

// server listen
app.listen(3000, () => {
  console.log("Server started on Port 3000");
});
