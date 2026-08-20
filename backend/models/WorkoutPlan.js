const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  goal: {
    type: DataTypes.STRING,
    defaultValue: 'Hypertrophy & Strength'
  },
  durationWeeks: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  weeklySchedule: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  exercises: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  instructions: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

WorkoutPlan.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = WorkoutPlan;
