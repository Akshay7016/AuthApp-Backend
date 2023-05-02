const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/Auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);

// testing protected route for single middleware
router.get("/test", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the protected route for TESTS"
    })
})

// Protected routes
router.get("/student", auth, isStudent, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the protected route for STUDENT"
    })
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the protected route for ADMIN"
    })
})

module.exports = router;