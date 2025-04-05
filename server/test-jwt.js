const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FmNmUwODczMjljZWFhYTg5MDc3YTciLCJpYXQiOjE3NDM0Njc2MjYsImV4cCI6MTc0MzQ3MTIyNn0.dyCCZkmk8jYll5-7rV3qOzPeFw-meiPMTI5qWBbNzU8";

const secretKey = "mySuperSecretKey"; // 🔴 Make sure this is exactly the same key as in .env

try {
  const decoded = jwt.verify(token, secretKey); 
  console.log("Token is valid ✅:", decoded);
} catch (error) {
  console.log("Token verification failed ❌:", error.message);
}
