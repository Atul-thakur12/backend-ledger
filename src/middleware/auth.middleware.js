const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {

    try {  
        // ✅ CHANGED: Wrapped entire logic inside try/catch
        // So JWT errors or DB errors are properly handled

        const token =
            req.cookies.token || 
            req.headers.authorization?.split(" ")[1];

        // ✅ CHANGED: Token check is now separate
        // If token missing → immediately return
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token is missing",
            });
        }

        // ✅ CHANGED: Now token verification runs OUTSIDE the if block
        // (Previously it was incorrectly placed inside if(!token))
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ CHANGED: Fetch user from DB using decoded ID
        const user = await userModel.findById(decoded.userId);

        // Optional but recommended check
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        // ✅ Attach user to request object
        req.user = user;

        // ✅ VERY IMPORTANT: Call next() so request continues
        return next();

    } catch (err) {

        // ✅ CHANGED: Properly handle invalid/expired token errors
        return res.status(401).json({
            message: "Unauthorized access, token is invalid",
        });
    }
}

module.exports = {
    authMiddleware,
};
