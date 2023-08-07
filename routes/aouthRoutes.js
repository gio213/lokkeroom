import Router from "express";
import {
  sign_get,
  sign_post,
  login_get,
  login_post,
  lobby_get,
  home_get,
  home_redirect,
  logout_get,
} from "../controllers/authController.js";

const router = Router();
router.get("/", home_redirect);
router.get("/api/", home_get);
router.get("/api/register", sign_get);
router.post("/api/register", sign_post);
router.get("/api/login", login_get);
router.post("/api/login", login_post);
router.get("/api/lobby", lobby_get);
router.get("/api/logout", logout_get);

export default router;
