'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song_Involvements = sequelize.define('Song_Involvements', {
    song_id: DataTypes.INTEGER,
    artist_id: DataTypes.INTEGER,
    primary: DataTypes.BOOLEAN,
    featured: DataTypes.BOOLEAN,
    producer: DataTypes.BOOLEAN
  });

  Song_Involvements.associate = (models) => {
    Song_Involvements.belongsTo(models.Artists, {
      foreignKey: 'artistId'
    }),
    Song_Involvements.belongsTo(models.Songs, {
      foreignKey: 'songId'
    });
  };
  return Song_Involvements;
};
