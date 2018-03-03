'use strict';
module.exports = (sequelize, DataTypes) => {
  const Songs = sequelize.define('Songs', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    song_link: DataTypes.STRING,
  });

  Songs.associate = (models) => {
    Songs.belongsToMany(models.Artists, {
      through: models.Song_Involvements
    });
  };
  return Songs;
};
