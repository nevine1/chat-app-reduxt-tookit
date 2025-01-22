const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const connectDB = require('./config/connectDB');
require("dotenv").config();

const routerOfUsers = require('./routers/userRouter')
app.use(cors(/* {
   origin:  process.env.FRONTEND_URL
} */))

const port = process.env.PORT || 8000;

app.use(express.json())

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


