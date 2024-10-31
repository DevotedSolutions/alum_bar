const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: "user",
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
});

const Userdata = mongoose.model("users", UserSchema);
module.exports = Userdata;
