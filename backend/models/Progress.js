const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recordedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  weightKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  bodyFatPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  bmi: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  chestCm: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  waistCm: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  armCm: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  legCm: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  personalRecords: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  timestamps: true
});

Progress.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Progress;
