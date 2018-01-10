'use strict';
module.exports = (sequelize, DataTypes) => {
  var Song_Involvements = sequelize.define('Song_Involvements', {
    song_id: DataTypes.INTEGER,
    artist_id: DataTypes.INTEGER,
    primary: DataTypes.BOOLEAN,
    featured: DataTypes.BOOLEAN,
    producer: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Song_Involvements;
};