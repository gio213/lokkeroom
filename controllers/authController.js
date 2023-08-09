import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../database/dbConection.js";
import { json } from "express";
import { generateJwt } from "../utils/generateJWT.js";
import session from "express-session";

const sign_get = async (req, res) => {
  res.render("signup.ejs");
};

const sign_post = async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm) {
    res.status(401).render("signup.ejs", {
      errorField: "Please fill all the fields",
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
        "select username from lokkeroom_db.users WHERE username = ?",
          [username],
          async (error, results) => {
            if (error) {
              console.log(error);
            }
            if (results.length > 0) {
              res.status(401).render("signup.ejs", {
                errorUsernameMessage: "That username is already in use",
              });
              console.log("That username is already in use");
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
            user_id: results[0].user_id,
            username: results[0].username,
            email: results[0].email,
            role: results[0].role,
            created_at: results[0].created_at,
          };
          const token = generateJwt({ id: user.user_id });

          // res.cookie("token", token, {
          //   expires: new Date(Date.now() + 300000),
          //   httpOnly: true,
          // });
          res.cookie("token", token, {
            expires: new Date(Date.now() + 300000),
            httpOnly: false,
          });

          res.status(200).redirect("/api/lobby");
        }
      }
    );
  }
};

const lobby_get = async (req, res) => {
  // const user = JSON.parse(req.query.user);
  res.render("lobby.ejs", {
    // user: user,
  });
};
const lobby_post = async (req, res) => {
  const user = JSON.parse(req.query.user);
  const message = {
    lobby_id: 1,
    username: user.username,
    user_id: user.user_id,
    message_content: req.body.message,
    created_at: new Date(),
  };
  db.query(
    "INSERT INTO lokkeroom_db.messages SET ? ",
    message,
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        res.status(200).redirect("/api/lobby?user=" + JSON.stringify(user));
      }
    }
  );
};

const home_get = async (req, res, next) => {
  res.render("home.ejs");
};

const logout_get = async (req, res) => {
  res.redirect("/");
};

export {
  sign_get,
  sign_post,
  login_get,
  login_post,
  lobby_get,
  home_get,
  logout_get,
  lobby_post,
};
