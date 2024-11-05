import { addSong } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.midddleware.js";
import { Router } from "express";

const router=Router();

router.route("/add").post(verifyJWT,addSong)

export default router