import express from 'express'
const app = express();
import {connectDb} from "./db/db.js"
import { connect } from 'mongoose';

connectDb();// Mongodb


app.listen(3000 ,()=>{
    console.log("server is runninga at port 3000")
})

