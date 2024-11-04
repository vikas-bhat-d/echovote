import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.midddleware.js";

const router=Router()
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').delete(verifyJWT,logoutUser)

export default router