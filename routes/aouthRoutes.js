import Router from "express";
import {
  sign_get,
  sign_post,
  login_get,
  login_post,
  lobby_get,
  home_get,
  logout_get,
  lobby_post,
} from "../controllers/authController.js";
import { getUserController } from "../controllers/getUserConteroller.js";

const router = Router();

router.get("/", home_get);
router.get("/api/register", sign_get);
router.post("/api/register", sign_post);
router.get("/api/login", login_get);
router.post("/api/login", login_post);
router.get("/api/lobby", lobby_get);
router.post("/api/lobby", lobby_post);
router.get("/logout", logout_get);
router.post("/api/get-user", getUserController);

export default router;
