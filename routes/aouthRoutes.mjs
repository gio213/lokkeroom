import { Router } from "express";
import {
  sign_get,
  sign_post,
  login_get,
  login_post,
  lobby_get,
  home_get,
} from "../controllers/authController.mjs";
const router = Router();
router.get("/", home_get);
router.get("/signup", sign_get);
router.post("/signup", sign_post);
router.get("/login", login_get);
router.post("/login", login_post);
router.get("/lobby", lobby_get);

export default router;
