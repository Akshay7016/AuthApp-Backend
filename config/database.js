const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Database connection successful");
    } catch (error) {
        console.log("Error in database connection: ", error.message);
    }
};

module.exports = dbConnect;