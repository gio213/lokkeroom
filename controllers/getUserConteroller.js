import { json } from "express";
import db from "../database/dbConection.js";

export const getUserController = (req, res) => {
  const { body } = req;

  console.log(body.id);

  db.query(
    "SELECT * FROM lokkeroom_db.users where user_id = ?",
    [body.id],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      console.log(results);
      res.status(200).send(results);
    }
  );
};
