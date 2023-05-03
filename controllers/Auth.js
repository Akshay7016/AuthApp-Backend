const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

// signup controller
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists!"
            });
        }

        // secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password"
            })
        }

        // create User entry in database
        const user = await User.create({
            name, email, password: hashedPassword, role
        });

        res.status(200).json({
            success: true,
            message: "Sign up successful!"
        })
    } catch (error) {
        return res.status(503).json({
            success: false,
            data: error.message,
            message: "Something went wrong!"
        })
    }
};

// login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid email and password!"
            })
        }

        // check for registered user
        let user = await User.findOne({ email });

        // if not registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered!"
            })
        }

        // payload to be sent with JWT token
        const payload = {
            email: user.email,
            role: user.role,
            id: user._id
        }

        // verify password and create JWT token
        if (await bcrypt.compare(password, user.password)) {
            // create JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            // TODO: check without toObject method
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                // cookie expires in 3 days
                expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
                // prevents client-side scripts from accessing data
                httpOnly: true
            }

            // creating cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully!"
            });

        } else {
            return res.status(403).json({
                success: false,
                message: "Incorrect password!"
            })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            data: error.message,
            message: "Something went wrong!"
        })
    }
};
