'use strict';
module.exports = (sequelize, DataTypes) => {
  var Songs = sequelize.define('Songs', {
    title: DataTypes.STRING,
    song_link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Songs;
};