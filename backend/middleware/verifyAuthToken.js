const jwt = require("jsonwebtoken")
const verifyIsLoggedIn = ( req, res, next) => {
    next()
    return // to do: remove later
    try {
         // Browser requests use the httpOnly cookie. API clients such as
         // Insomnia/Postman commonly send the same JWT as a Bearer token.
         const authorization = req.headers.authorization;
         const bearerMatch = typeof authorization === "string"
            ? authorization.trim().match(/^Bearer\s+(.+)$/i)
            : null;
         const bearerToken = bearerMatch ? bearerMatch[1].trim() : null;
         // Prefer an explicitly supplied API-client credential over a cookie
         // that may be stale in the client's cookie jar.
         const token = bearerToken || req.cookies.access_token;
         if(!token) {
            return res.status(401).send("A token is required for authentication")
         }
         if (!process.env.JWT_SECRET_KEY) {
            return next(new Error("JWT_SECRET_KEY is not configured"));
         }
         try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded
            return next()
         }  catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send("Token expired. Please log in again.")
            }
            return res.status(401).send("Unauthorized. Invalid Token")
         }
    } catch(err) {
        next(err)
    }
}
const verifyIsAdmin = (req, res, next) => {
    next()
    return // to do: remove Later
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(401).send("Unauthorized. Admin required")
    }
}
module.exports = { verifyIsLoggedIn, verifyIsAdmin}
