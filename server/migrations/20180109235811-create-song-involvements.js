'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Song_Involvements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      song_id: {
        type: Sequelize.INTEGER
      },
      artist_id: {
        type: Sequelize.INTEGER
      },
      primary: {
        type: Sequelize.BOOLEAN
      },
      featured: {
        type: Sequelize.BOOLEAN
      },
      producer: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Song_Involvements');
  }
};