const mongoose = require("mongoose"), config = require("../config.json");

mongoose.connect(encodeURI(config.database_uri), { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = client => ({
  // TODO make a database
})