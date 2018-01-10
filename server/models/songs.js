'use strict';
module.exports = (sequelize, DataTypes) => {
  const Songs = sequelize.define('Songs', {
    title: DataTypes.STRING,
    song_link: DataTypes.STRING
  });

  Songs.associate = (models) => {
    Songs.hasMany(models.Song_Involvements, {
      foreignKey: 'artistId',
      as: 'songInvolvements'
    }),
    Songs.hasMany(models.Artists, {
      foreignKey: 'artistId',
      as: 'artists'
    });
  };
  return Songs;
};
