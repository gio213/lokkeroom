import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../database/dbConection.js";

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
            role: results[0].admin,
            created_at: results[0].created_at,
          };
          console.log(results[0].user_id);
          res.status(200).redirect("/api/lobby?user=" + JSON.stringify(user));
        }
      }
    );
  }
};

const lobby_get = async (req, res) => {
  const user = JSON.parse(req.query.user);
  res.render("lobby.ejs", {
    user: user,
  });
};

const home_get = async (req, res) => {
  res.render("home.ejs");
};
const home_redirect = async (req, res) => {
  res.redirect("/api");
};
const logout_get = async (req, res) => {
  res.redirect("/api");
};

export {
  sign_get,
  sign_post,
  login_get,
  login_post,
  lobby_get,
  home_get,
  home_redirect,
  logout_get,
};
