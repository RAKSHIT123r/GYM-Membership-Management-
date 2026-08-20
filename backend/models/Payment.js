const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('Card', 'UPI', 'Stripe', 'Razorpay', 'Cash'),
    defaultValue: 'Razorpay'
  },
  status: {
    type: DataTypes.ENUM('Success', 'Pending', 'Failed', 'Refunded'),
    defaultValue: 'Success'
  },
  paymentType: {
    type: DataTypes.ENUM('Membership Purchase', 'Membership Renewal', 'Class Booking', 'Refund', 'Locker Rental'),
    defaultValue: 'Membership Purchase'
  },
  associatedId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  receiptUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

Payment.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Payment;
