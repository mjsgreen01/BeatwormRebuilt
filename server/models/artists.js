'use strict';
module.exports = (sequelize, DataTypes) => {
  const Artists = sequelize.define('Artists', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Artists.associate = (models) => {
    Artists.hasMany(models.Song_Involvements, {
      foreignKey: 'artistId',
      as: 'songInvolvements',
    }),
    Artists.hasMany(models.Songs, {
      foreignKey: 'artistId',
      as: 'songs'
    });
  };
  return Artists;
};
