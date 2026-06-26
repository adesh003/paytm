import express from 'express'
const app = express();
import {connectDb} from "./db/db.js"
import { connect } from 'mongoose';
import {cors} from 'cors'
import routes from "./Routes/routes.js"

app.use(cors());

app.use(express.json())
connectDb();

// routes.use("/", routes); 

app.use(routes);

app.listen(3000 ,()=>{
    console.log("server is runninga at port 3000")
})