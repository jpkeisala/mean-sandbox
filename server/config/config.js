var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/mean-sandbox',
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://jpkeisala:mean-sandbox@ds027489.mongolab.com:27489/mean-sandbox',
    port: process.env.PORT || 80
  }
}