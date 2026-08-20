const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Waitlist = sequelize.define('Waitlist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('Waiting', 'Promoted', 'Cancelled'),
    defaultValue: 'Waiting'
  }
}, {
  timestamps: true
});

Waitlist.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Waitlist;
