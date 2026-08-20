const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING,
    defaultValue: 'General Fitness & Conditioning'
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 4.5
  }
}, {
  timestamps: true
});

Trainer.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Trainer;
