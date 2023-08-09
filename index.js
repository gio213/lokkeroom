import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/aouthRoutes.js";
import session from "express-session";
const port = process.env.PORT;

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
  res.locals.userLogin = "";
  next();
};

app.use(setMessageMiddleware);

// parse json data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define routes
app.use("/", authRoutes);

//set cookieparser and session
app.use(cookieParser("secretStringForCookie"));
//

// view engine setup
app.set("view engine ", "ejs");

// server listen
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is successfully running at port ${port} `);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
