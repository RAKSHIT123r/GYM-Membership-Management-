const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: 'info@apexfit.com'
  },
  openingHours: {
    type: DataTypes.STRING,
    defaultValue: '5:00 AM - 11:00 PM'
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 250
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

Branch.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Branch;
