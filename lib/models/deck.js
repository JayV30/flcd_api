module.exports = function(sequelize, DataTypes) {
    var Deck = sequelize.define('deck', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
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