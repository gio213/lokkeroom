import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config({ path: "./.env" });
import db from "../dbConection.mjs";
import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";
import session from "express-session";
import multer from "multer";

const upload = multer({ dest: "static/uploads/" });

const sign_get = async (req, res) => {
  res.render("signup.ejs");
};

const sign_post = async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm) {
    return res.render("signup.ejs", console.log("Please fill all the fields"), {
      message: "Please fill all the fields",
    });
  } else {
    db.query(
      "SELECT email FROM lokkeroom_db.users WHERE email =?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          res.status(401).render("signup.ejs", {
            errorEmailMessage: "That email is already in use",
          });
        } else if (password !== passwordConfirm) {
          res.status(401).render("signup.ejs", {
            errorPasswordMatchMessage: "Passwords do not match",
          });
        }
        "select username from lokkeroom_db.users where username = ?",
          [username],
          async (error, results) => {
            if (error) {
              console.log(error);
            }
            if (results.length > 0) {
              res.status(1062).render("signup.ejs", {
                errorUsernameMessage: "That username is already in use",
              });
            }
          };

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query(
          "INSERT INTO lokkeroom_db.users SET ? ",
          {
            username: username,
            email: email,
            password: hashedPassword,
          },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(results);
              res.status(200).render("signup.ejs", {
                userRegistered: "User registered go to login page",
              });
            }
          }
        );
      }
    );
  }
};

const login_get = async (req, res) => {
  res.render("login.ejs");
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(200).render("login.ejs", {
      errorField: "Please fill all the fields",
    });
  } else {
    db.query(
      "SELECT * FROM lokkeroom_db.users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("login.ejs", {
            loginError: "Email or password is incorrect",
          });
        } else {
          const user = {
            id: results[0].id,
            username: results[0].username,
            email: results[0].email,
          };
          res.status(200).render("lobby.ejs", {
            message: "User logged in",
            user: user,
          });
        }
      }
    );
  }
};

const lobby_get = async (req, res) => {
  res.render("lobby.ejs");
};

const home_get = async (req, res) => {
  res.render("home.ejs");
};

export { sign_get, sign_post, login_get, login_post, lobby_get, home_get };
