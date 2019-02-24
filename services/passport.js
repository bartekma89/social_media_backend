const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const config = require("../config");
const User = require("../model/user");
const isEmpty = require("lodash").isEmpty;

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secretKey.key
};

const localOptions = {
  usernameField: "email"
};

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).exec();

      if (isEmpty(user)) {
        return done(null, false);
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          return done(null, false);
        }

        return done(null, user);
      });
    } catch (err) {
      return done(err, false);
    }
  }
);

const jwtLogin = new JwtStrategy(JwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
