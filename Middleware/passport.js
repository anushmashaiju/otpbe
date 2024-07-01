const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const User = require('../Model/userModel');

dotenv.config();

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
          let user = await User.findOne({ googleID: profile.id, email: profile.emails[0].value });

          if (!user) {
              const newUser = {
                  googleID: profile.id,
                  displayName: profile.displayName,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  profilePic: profile.photos[0].value,
                  email: profile.emails[0].value,
                  qualification: "",
                  professional: "",
                  dateOfBirth: "",
                  age: "",
                  gender: "",
                  city: "",
                  state: "",
                  district: "",
                  password: "",
                  confirmPassword: "",
                  isAdmin: false,
                  isStaff: false
              };

              user = new User(newUser);
              await user.save();
              done(null, { user, isNew: true });
          } else {
              user.googleID = profile.id;
              await user.save();
              done(null, { user, isNew: false });
          }
      } catch (err) {
          console.error(err);
          done(err, null);
      }
    }
  ));

  passport.serializeUser((data, done) => {
    done(null, data.user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
