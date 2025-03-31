const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Token from request header:", token);  // Log token to check if it's coming in correctly

  // If no token is provided, respond with 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      message: "Token is required",
      logout: true,
    });
  }

  let decoded;

  try {
    // Verify the token using JWT_SECRET_KEY
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);  // Log the decoded token to ensure it's correctly verified
  } catch (err) {
    // If token verification fails (e.g., expired or invalid token), respond with 401
    console.error("Token verification failed:", err);
    return res.status(401).json({
      message: "Invalid token",
      logout: true,
    });
  }

  // Attach the decoded token data (user information) to the request object for further use
  req.user = decoded;

  // Proceed to the next middleware or route handler
  next();
};

module.exports = authMiddleware;
