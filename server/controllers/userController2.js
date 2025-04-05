const express = require('express');
const User = require('../models/UserModel');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY)
const jwt = require('jsonwebtoken');
require("dotenv").config();
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profile_pic } = req.body;
        console.log(req.body);

        if (!name || !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "This user already exists",
                error: true
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profile_pic
        });

        const savedUser = await newUser.save();

        return res.status(201).json({
            message: "New user successfully registered",
            success: true,
            data: {
                name: savedUser.name,
                email: savedUser.email,
                password,
                profile_pic: savedUser.profile_pic
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        });
    }
};

const loginByEmail = async (req, res) => {

    try{
        const { email } = req.body;
    console.log("req emsil:",req.body);

        const user = await User.findOne({email}).select("-password");
        //using select(-password), means do not return password when u login

        if(!user){
            return res.status(400).json({
                message: "This email is not registered", 
                error: true
            })
        }

        /* const responseData = {
            message: "Email is verified",
            success: true,
            data: { user }
        };
        console.log("Response Data Before Sending:", responseData); */
        return res.status(200).json({
            message: "Email is verified",
            success: true, 
            data: { user }
        })
    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}


const loginByPass = async (req, res) => {
    try {
        // Extract email and password from the request
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate a new authentication token
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Send user data along with the token
        return res.status(200).json({
            message: "Login successful",
            token: authToken,
            user: {
                name: user.name,
                email: user.email,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getToken = (req, res) => {
    const token = req.cookies.token; // Read token from cookies
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }
    res.json({ token });
}
const resetPass = async (req, res) => {

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Create Reset Link
        const resetLink = `${process.env.FRONTEND_URL}/auth/newPassword?token=${resetToken}`;

        // Send Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset.</p>
                   <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
                   <p>This link will expire in 1 hour.</p>`,
        });

        res.json({ message: "Reset link sent to email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const newPass = async (req, res) => {

    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}



const userDetails = async (req, res) => {

    try{

        const token = req.cookies.token || "";
        console.log(" cookie token is : ", token)

        if(!token){
            return {
                message : "session expired", 
                logout: true 
            };
        }
    
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY) //this code to decode the information included in the token which is used in login in user
        console.log(decode)
        const user  = await User.findById(decode.userId).select("-password");
        
        return res.status(200).json({
            message:"getting user details", 
            data: user, 
            success: true
        })
    }catch(err){
        return res.status(500).json({
            message: err.message || err, 
            error: true
        })
    }
}

const logout = async (req, res) => {

    try{
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        };
        
        /* res.cookie(token, " ", cookieOptions) */;

       /*  return res.cookie('token', " ", cookieOptions).status(200).json({
            message: "session expired", 
            success: true
        }) */
        res.clearCookie("token", cookieOptions).status(200).json({
            message: "Session expired",
            success: true
        });
    }catch(err){
        return res.status(500).json({
            message: err.message || err, 
            error: true
        })
    }
}




const updateUserDetails = async (req, res) => {
    console.log("🔥 Top req.body is:", req.body);
    console.log("🔥 Top req.file is:", req.file);

    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("✅ Token is valid:", decoded);
        } catch (error) {
            console.log("❌ Token verification failed:", error.message);
            return res.status(401).json({ message: "Invalid or expired token", logout: true });
        }

        console.log("📌 Decoded Token:", decoded);

        // Find user by ID from token
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", error: true });
        }

        console.log("👤 User details before update:", user);

        // Extract new values from request body
        const { name } = req.body;
        console.log("📜 Name in req.body:", req.body.name);
        console.log("📂 Uploaded file:", req.file);

        const profile_pic = req.file ? req.file.filename : user.profile_pic; 

        if (!name) {
            return res.status(400).json({ message: "Name is required", error: true });
        }

        // Update user details 
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { name, profile_pic },
            { new: true }
        );

        return res.status(200).json({
            message: "✅ User updated successfully",
            data: updatedUser,
            success: true
        });
    } catch (err) {
        console.error("💥 Error in updateUserDetails:", err);
        return res.status(500).json({ message: err.message || "Internal server error", error: true });
    }
};



module.exports = {
    registerUser,
    loginByEmail,
    loginByPass,
    getToken,
    resetPass,
    newPass,
    userDetails, 
    logout, 
    updateUserDetails
};
