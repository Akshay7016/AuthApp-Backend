const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth middleware
exports.auth = (req, res, next) => {
    try {
        // fetch JWT token, we can fetch JWT Token from
        // 1. req.body      2. Cookies       3. Header
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing!"
            })
        }

        // verify token
        try {
            const userData = jwt.verify(token, process.env.JWT_SECRET);

            // We are adding payload in req.user, not in req.body
            req.user = userData;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid!"
            })
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Something went wrong, while verifying token!"
        })
    }
};

// isStudent middleware
exports.isStudent = (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Students! You are Admin!!!"
            })
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User role is not matching!"
        })
    }
};

// isAdmin middleware
exports.isAdmin = (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin! You are Student"
            })
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User role is not matching!"
        })
    }
};