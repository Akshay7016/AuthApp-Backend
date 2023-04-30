const bcrypt = require("bcrypt");
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