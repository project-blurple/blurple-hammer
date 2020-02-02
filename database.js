const mongoose = require("mongoose");

module.exports = (client, config, constants) => {
  mongoose.connect(encodeURI(config.database_uri), { useNewUrlParser: true, useUnifiedTopology: true });

  return {
    
  }
}