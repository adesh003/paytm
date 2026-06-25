import mongoose from 'mongoose'



export const connectDb = async () => {
    
 const instance = await mongoose.connect("mongodb+srv://theadeshkumar03_db_user:Oz2jjA3aztI0ZE65@paytm.lier7wf.mongodb.net/?appName=Paytm")
.then(()=> console.log("Connected to MongoDb..🔥🔥"))
.catch(err => console.log("err while connecting Db",err))
}





