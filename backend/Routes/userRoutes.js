import express from "express";
import { Router } from "express";
import {updateUserData, userLogin,userSignup} from"../controller/userController.js"
import AuthMiddleware from "../Authmiddleware.js";
console.log("userRoutes loaded");
const  router = Router();


router.post('/signup',userSignup)
router.post('/login',userLogin)
router.put('/update',AuthMiddleware ,updateUserData)



 export default router;
