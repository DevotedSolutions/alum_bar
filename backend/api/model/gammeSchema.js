const mongoose = require('mongoose');


const gammeSchema = mongoose.Schema({
  gamme: {
    type: String,
  }
});

const gammeModel = mongoose.model('gamme', gammeSchema);

module.exports = gammeModel;