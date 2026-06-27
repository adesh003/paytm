import express from "express";
import { Router } from "express";
import AuthMiddleware from "../Authmiddleware.js";
const  router = express.Router();
import {transfer, userBalance} from "../controller/userController.js"

router.get("/balance" ,AuthMiddleware, userBalance)
router.post("/transfer" ,AuthMiddleware, transfer)

export default router;