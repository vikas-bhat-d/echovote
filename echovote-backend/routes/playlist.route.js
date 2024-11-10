import { addSong, fetchPlaylist, removeSong } from "../controllers/playlist.controller.js";
import { searchMusic } from "../controllers/youtube.controller.js";
import { verifyJWT } from "../middlewares/auth.midddleware.js";
import { Router } from "express";

const router=Router();

router.route("/search").get(searchMusic);
router.route("/:venueName").get(fetchPlaylist)
router.route("/add").post(addSong)
router.route("/remove").post(removeSong)

export default router