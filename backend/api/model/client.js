const mongoose = require("mongoose");

// Define the schema for storing client details and file information
const clientSchema = new mongoose.Schema({
  clientName: String,
  devisNumber: String,
  email: String,
  phone: String,
  filePath: String, // Path where the file is saved
  uploadedAt: { type: Date, default: Date.now },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
