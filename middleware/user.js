const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const token = req.headers.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

        req.id = decoded.id;
        next();
    } catch (err) {
        res.status(403).json({
            message: "You are not signed in"
        });
    }
}

module.exports = { userMiddleware }