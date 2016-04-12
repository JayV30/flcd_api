module.exports = function(sequelize, DataTypes) {
    
    var Deck = sequelize.define('deck', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255],
                uniqueDefaultDeck: function(value, next) {
                    if (value === 'non-sorted') {
                        var self = this;
                        Deck.find({where: {userId: self.userId, title: value}}).then(function(deck) {
                           if (deck) {
                               next('\'non-sorted\' is a reserved deck title');
                           } else {
                               next();
                           }
                        });
                    } else {
                        next();
                    }
                }
            }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        scopes: {
            visible: {
                where: {
                    visible: true
                }
            }
        }
    });
    
    return Deck;
};