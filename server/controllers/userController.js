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

        const checkEmail = await User.findOne({email}).select("-password");
        //using select(-password), means do not return password when u login

        if(!checkEmail){
            return res.status(400).json({
                message: "This email is not registered", 
                error: true
            })
        }

        return res.status(200).json({
            message: "Email is verified",
            success: true, 
            data: checkEmail
        })
    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}

const loginByPass = async (req, res) =>{

    try{
        const { password , userId} = req.body;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "user is not found",
                error: true
            })
        }
        const deHashedPass = await bcrypt.compare(password, user.password)

        if(!deHashedPass){
            return res.status(400).json({
                message: "This password is not correct", 
                error: true
            })
        }
        
        const jwtData = {
            id: user._id, 
            email: user.email
        } //these are the data wanted to return in the token 

        const token = await jwt.sign(jwtData, process.env.JWT_SECRET_KEY, { expiresIn: '1d'});
       
        const cookieOptions = {
            http: true, 
            secure: true
        }
        return res.cookie('token', token, cookieOptions).status(200).json({
            message: "Password is verified", 
            success: true, 
            data: { user }, 
            token: token
        })
    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }
}
module.exports = {
    registerUser,
    loginByEmail,
    loginByPass
};
