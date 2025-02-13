const express = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
                password: savedUser.password,
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

        const user = await User.findOne({email}).select("-password");
        //using select(-password), means do not return password when u login

        if(!user){
            return res.status(400).json({
                message: "This email is not registered", 
                error: true
            })
        }

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
        const { email, password } = req.body;
       
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ message: "User not found" });
        }
        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );
        console.log("Login successful, token generated.");
        return res.status(200).json({ message: "Login successful", success: true, token });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: err.message });
    }
};

const resetPass = async (req, res) =>{

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
        console.log(" token is : ", token)

        if(!token){
            return {
                message : "session expired", 
                logout: true 
            };
        }
    
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY) //this code to decode the information included in the token which is used in login in user
        console.log(decode)
        const user  = await User.findById(decode.id).select("-password");
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

        return res.cookie('token', " ", cookieOptions).status(200).json({
            message: "session expired", 
            success: true
        })
    }catch(err){
        return res.status(500).json({
            message: err.message || err, 
            error: true
        })
    }
}

const updateUserDetails = async (req, res) => {
    try {
        const token = req.cookies.token || "";
        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(401).json({
                message: "Session expired",
                logout: true
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            console.error("Token verification error:", err.message);
            return res.status(401).json({
                message: "Invalid or expired token",
                logout: true
            });
        }

        console.log("Decoded Token:", decoded);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }

        const { name, profile_pic } = req.body;
        if (!name || !profile_pic) {
            return res.status(400).json({
                message: "Name and profile picture are required",
                error: true
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { name, profile_pic },
            { new: true }
        );

        return res.status(200).json({
            message: "User information updated successfully",
            data: updatedUser,
            success: true
        });
    } catch (err) {
        console.error("Error in updateUserDetails:", err);
        return res.status(500).json({
            message: err.message || "Internal server error",
            error: true
        });
    }
};


module.exports = {
    registerUser,
    loginByEmail,
    loginByPass,
    resetPass,
    newPass,
    userDetails, 
    logout, 
    updateUserDetails
};
