'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song_Involvements = sequelize.define('Song_Involvements', {
    song_id: DataTypes.INTEGER,
    artist_id: DataTypes.INTEGER,
    primary: DataTypes.BOOLEAN,
    featured: DataTypes.BOOLEAN,
    producer: DataTypes.BOOLEAN
  });
  return Song_Involvements;
};
