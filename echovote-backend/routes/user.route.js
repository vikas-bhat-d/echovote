import { Router } from "express";
import { registerUser,loginUser,logoutUser, changePassword, changeUsername, changeEmail } from "../controllers/user.controller.js";

const router=Router()
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').delete(verifyJWT,logoutUser)

export default router