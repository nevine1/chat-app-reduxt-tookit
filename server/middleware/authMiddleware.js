const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token

        if (!token) {
            return res.status(401).json({ message: "No token provided", error: true });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token

        req.user = decoded; // Attach decoded user to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token", error: true });
    }
};
