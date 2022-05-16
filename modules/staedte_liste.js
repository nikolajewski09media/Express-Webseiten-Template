const mongoose = require("mongoose");

const staedteSchema = new mongoose.Schema({
  ort: String,
  ortUrl: String,
  hauptort: String,
  hauptortUrl: String,
  bundesland: String,
  bundeslandUrl: String,
});

const StaedteListe = mongoose.model("staedte", staedteSchema);

module.exports = StaedteListe;
