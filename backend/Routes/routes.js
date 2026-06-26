import express, { Router } from 'express'

import userRouter from "./userRoutes.js"

const routes = Router();
console.log("routes loaded");
routes.use("/api/v1", userRouter);

export default routes;

