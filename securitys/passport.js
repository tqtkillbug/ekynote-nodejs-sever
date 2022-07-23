const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const {User, Keyword} = require("../model/model");
const dotenv = require('dotenv');

dotenv.config();


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        //get the user data from google 
        const newUser = new User ({
          name: profile.name.givenName +" "+ profile.name.familyName,
          email: profile.emails[0].value,
          password: "loginwithgoogletest1234"
        })
        try {
          //find the user in our database 
          let user = await User.findOne({ email: profile.emails[0].value})
          if (user) {
            //If user present in our database.
            done(null, user)
          } else {
            const usersave = await newUser.save();
            done(null, usersave)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
