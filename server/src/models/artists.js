'use strict';
module.exports = (sequelize, DataTypes) => {
  const Artists = sequelize.define('Artists', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // defaultValue: "Sam",
    },
  });

  Artists.associate = (models) => {
    Artists.belongsToMany(models.Songs, {
      through: models.Song_Involvements
    });
  };
  return Artists;
};
