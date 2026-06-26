import jwt from "jsonwebtoken"

function AuthMiddleware(req,res,next){
    const token = req.headers.token

    const decodeUser = jwt.verify(token,"adeshkumarboss")

    if(decodeUser){
        req.userId=decodeUser.userId
        next();
    }

   else{
            res.status(403).json({
                message:"token is invalid"
            })
        }
}
export default AuthMiddleware;