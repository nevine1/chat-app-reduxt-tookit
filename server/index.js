const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const connectDB = require('./config/connectDB');
const cookiesParser = require("cookie-parser")
require("dotenv").config();

const routerOfUsers = require('./routers/userRouter')

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true // Allow credentials (cookies)
}));
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cookiesParser())
//users endpoint api 
app.use("/api/users", routerOfUsers);

app.use("/", (req, res) =>{
    res.json({
        message:"server is running very well at: " + port
    })
})



connectDB().then(() =>{
    app.listen(port , () =>{
        console.log(`server is running on port: ${port}`)
    })
});


