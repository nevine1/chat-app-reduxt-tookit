const express = require('express');
const cors = require("cors");
const multer = require('multer');
const cookieParser = require("cookie-parser");

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); // ✅ Parse JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Parse form data
app.use(cookieParser());


require("dotenv").config();
const connectDB = require('./config/connectDB');
const routerOfUsers = require('./routers/userRouter');


app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
}));

const DEFAULT_PORT = process.env.PORT;
let port = DEFAULT_PORT;

// Users endpoint API
app.use("/api/users", routerOfUsers);

app.get("/", (req, res) => {
    res.json({ message: `Server is running very well at: ${port} ,  ${req}` });
    console.log(req.url)
});

connectDB().then(() => {
    const server = app.listen(port, () => {
        console.log(`✅ Server is running on port: ${port}`);
    });

    // Handle "port already in use" error
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${port} is already in use. Trying another port...`);
            port++; 
            server.listen(port, () => {
                console.log(`Server started on port: ${port}`);
            });
        } else {
            console.error("Server error:", err);
        }
    });
});
