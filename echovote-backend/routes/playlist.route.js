import { addSong, fetchPlaylist } from "../controllers/playlist.controller.js";
import { searchMusic } from "../controllers/youtube.controller.js";
import { verifyJWT } from "../middlewares/auth.midddleware.js";
import { Router } from "express";

const router=Router();

router.route("/search").get(verifyJWT,searchMusic);
router.route("/:venueName").get(fetchPlaylist)
router.route("/add").post(verifyJWT,addSong)

export default router