const mongoose = require("mongoose");

module.exports = (client, config) => {
  mongoose.connect(encodeURI(config.database_uri), { useNewUrlParser: true, useUnifiedTopology: true });

  return {
    
  }
}