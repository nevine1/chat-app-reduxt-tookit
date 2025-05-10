const jwt = require('jsonwebtoken')
const User= require('../models/UserModel')

const getUserDetails = async(token)=>{
    
    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }

    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)

    const user = await User.findById(decode.id).select('-password')

    return user
}



const getUserDetailsFromToken = async (token) => {

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        const user = await User.findById(decoded.userId).select("-password");
        return user;

    } catch (error) {
        
        console.error("Token verification failed:", error.message);
        return null;
    }
};


module.exports = {
    getUserDetails,
    getUserDetailsFromToken
}