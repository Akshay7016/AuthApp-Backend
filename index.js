const express = require("express");
const app = express();

// Port
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());

// route
const user = require("./routes/user");
app.use("/api/v1", user)

// listen
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//database
const dbConnect = require("./config/database");
dbConnect();