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
    type: Array,
    default: ["user"],
  },
  password: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    default: "MRU",
  },
  token: {
    type: String,
  },
});

const Userdata = mongoose.model("users", UserSchema);
module.exports = Userdata;
