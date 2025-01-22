const express = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

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

module.exports = {
    registerUser
};
