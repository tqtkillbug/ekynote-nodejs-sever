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
const viewRoute = require("./routes/view");

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("common"));
app.use(cookiePaser());
app.set("views","views");
app.set("view engine","ejs");
app.use(express.static("public"));
dotenv.config();
// Config DB

app.use("/api/user", userRoute);

app.use("/api/keyword", keywordRoute);

app.use("/api/auth",authRoute);

app.use("/",viewRoute);


mongoose.connect((process.env.mongodb_url), () => {
    console.log("Connected mongobd");
})


app.listen(process.env.PORT || 8000);