// Importing required modules
const express = require("express");
const cors = require('cors');
require('dotenv').config();





// Creating an instance of express
const app = express();
app.use(express.json());
// Determining the port based on environment
let port;
if (process.env.NODE_ENV === "development") {
    port = process.env.DEV_PORT || 4001;
}

// Middleware setup
app.use(cors()); // Enable CORS for all routes
require('./routers/ecommerce')(app)
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,Content-Type, Authorization, Accept"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
