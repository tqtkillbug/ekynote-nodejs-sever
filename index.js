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
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require("key");

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(morgan("common"));
app.use(cookiePaser());
dotenv.config();

passport.use(new GoogleStrategy());

// Config DB

app.use("/api/user", userRoute);

app.use("/api/keyword", keywordRoute);

app.use("/api/auth",authRoute);

mongoose.connect((process.env.mongodb_url), () => {
    console.log("Connected mongobd");
})


app.listen(process.env.PORT || 8000);


passport.use(new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: 'api/auth/google/callback'
  },

  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }

));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));