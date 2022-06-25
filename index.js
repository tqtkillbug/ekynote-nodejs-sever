const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookiePaser = require('cookie-parser');
const userRoute = require("./routes/user");
const keywordRoute = require("./routes/keyword");
const authRoute = require("./routes/auth");

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("common"));
app.use(cookiePaser());

dotenv.config();
// Config DB

app.use("/api/user", userRoute);

app.use("/api/keyword", keywordRoute);

app.use("/api/auth",authRoute);

mongoose.connect((process.env.mongodb_url), () => {
    console.log("Connected mongobd");
})

app.listen(3000,() => {
    console.log("server is runing..")
})