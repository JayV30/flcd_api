module.exports = function(sequelize, DataTypes) {
    return sequelize.define('deck', {
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
            allowNull: true,
            validate: {
                len: [1, 255]
            }
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        // user_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: User,
        //         key: 'id'
        //     }
        // }
    });
};