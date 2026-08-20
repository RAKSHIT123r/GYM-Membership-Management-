const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const NutritionPlan = sequelize.define('NutritionPlan', {
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
  dailyCalories: {
    type: DataTypes.INTEGER,
    defaultValue: 2400
  },
  proteinGrams: {
    type: DataTypes.INTEGER,
    defaultValue: 160
  },
  carbsGrams: {
    type: DataTypes.INTEGER,
    defaultValue: 250
  },
  fatsGrams: {
    type: DataTypes.INTEGER,
    defaultValue: 70
  },
  waterTargetLiters: {
    type: DataTypes.FLOAT,
    defaultValue: 3.5
  },
  meals: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  recommendedFoods: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  foodsToAvoid: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

NutritionPlan.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = NutritionPlan;
