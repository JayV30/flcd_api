var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var secrets = require('./secrets.json');
var sequelize;

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sequelize = new Sequelize(secrets.db.dev_name, secrets.db.username, secrets.db.password, {
        dialect: 'postgres'
    });
}

var db = {};

db.deck = sequelize.import(__dirname + '/lib/models/deck.js');
db.user = sequelize.import(__dirname + '/lib/models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;