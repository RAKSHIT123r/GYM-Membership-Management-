const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GymClass = sequelize.define('GymClass', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Yoga', 'Zumba', 'CrossFit', 'Strength Training', 'Cardio', 'HIIT', 'Boxing', 'Spinning'),
    allowNull: false
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  bookedSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  locationRoom: {
    type: DataTypes.STRING,
    defaultValue: 'Studio 1'
  }
}, {
  timestamps: true
});

GymClass.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = GymClass;
