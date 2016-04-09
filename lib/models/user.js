module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 255],
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 255]
            }
        },
        apiKey: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '123456',
            validate: {
                len: [1, 255]
            }
        }
    }, {
        instanceMethods: {
            toPublicJSON: function() {
                var json = this.toJSON();
                var jsonToReturn = {
                    "username": json.username,
                    "id": json.id,
                    "updatedAt": json.updatedAt,
                    "createdAt": json.createdAt
                };
                return jsonToReturn;
            },
            toUserJSON: function() {
                var json = this.toJSON();
                var jsonToReturn = {
                    "username": json.username,
                    "id": json.id,
                    "email": json.email,
                    "apiKey": json.apiKey,
                    "updatedAt": json.updatedAt,
                    "createdAt": json.createdAt
                }
                return jsonToReturn;
            }
        },
        hooks: {
            afterCreate: function(user, options) {
                user.createDeck({
                    "title": "non-sorted",
                    "category": "none",
                    "description": "Cards which have not been assigned to a deck.",
                    "visible": false
                }).then(function(deck) {
                    return deck;
                }, function(e) {
                    return Promise.reject(e);
                });
            }
        }
    });
    
    return User;
};