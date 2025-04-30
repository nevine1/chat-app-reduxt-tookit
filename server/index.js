const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require('./config/connectDB');
const routerOfUsers = require('./routers/userRouter');
const socketServer = require('./socket/index'); // Import the socket server function

const app = express(); // Create the Express app

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// API Routes
app.use("/api/users", routerOfUsers);

app.get("/", (req, res) => {
    res.json({ message: `Server is running very well at port: ${port}` });
    console.log(req.url);
});

const DEFAULT_PORT = process.env.PORT || 5000; // Add a default port
let port = DEFAULT_PORT;

connectDB().then(() => {
    const server = socketServer(app); // Pass the Express app to the socket server
    server.listen(port, () => {
        console.log(`✅ Server is running on port: ${port}`);
    });

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