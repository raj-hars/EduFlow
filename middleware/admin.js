const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
    const token = req.headers.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        req.id = decoded.id;
        next();
    } catch (err) {
        res.json(403).json({
            message: "You are not signed in"
        });
    }
}

module.exports = { adminMiddleware }