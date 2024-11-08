import { Router } from "express";
import { registerUser,loginUser,logoutUser, checkLog } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.midddleware.js";

const router=Router()

router.route('/isLoggedin').get(checkLog);
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').delete(verifyJWT,logoutUser)

export default router