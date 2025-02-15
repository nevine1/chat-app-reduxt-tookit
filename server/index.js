const express = require('express');
const cors = require('cors');
const cookiesParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require('./config/connectDB');
const routerOfUsers = require('./routers/userRouter');

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

const DEFAULT_PORT = process.env.PORT || 5001;
let port = DEFAULT_PORT;

app.use(express.json());
app.use(cookiesParser());

// Users endpoint API
app.use("/api/users", routerOfUsers);

app.get("/", (req, res) => {
    res.json({ message: `Server is running very well at: ${port}` });
});

connectDB().then(() => {
    const server = app.listen(port, () => {
        console.log(`✅ Server is running on port: ${port}`);
    });

    // Handle "port already in use" error
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`⚠️ Port ${port} is already in use. Trying another port...`);
            port++; 
            server.listen(port, () => {
                console.log(`✅ Server started on port: ${port}`);
            });
        } else {
            console.error("❌ Server error:", err);
        }
    });
});
