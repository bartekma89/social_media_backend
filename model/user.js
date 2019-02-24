const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
});

userSchema.pre("save", async function(next) {
  try {
    const user = this;

    const genSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, genSalt);
    user.password = hash;

    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function(password, cb) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);

    return cb(null, isMatch);
  } catch (err) {
    return cb(err);
  }
};

const UserClass = mongoose.model("user", userSchema);

module.exports = UserClass;
