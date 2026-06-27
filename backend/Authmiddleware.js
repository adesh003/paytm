import jwt from "jsonwebtoken";

function AuthMiddleware(req, res, next) {
    try {
        const token = req.headers.token;

        const decodedUser = jwt.verify(token, "adeshkumartheboss");

        req.userId = decodedUser.userId;

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

export default AuthMiddleware;