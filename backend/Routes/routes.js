import express, { Router } from 'express'

import userRouter from "./userRoutes.js"
import accountRouter from "./accountRoute.js"
const routes = Router();

routes.use("/api/v1/user", userRouter);
routes.use('/api/v1/account' ,accountRouter)
export default routes;

