require('dotenv').config();
const { Sequelize } = require('sequelize');

const connectionString =
  process.env.POSTGRES_URI ||
  `postgres://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'rakshu123'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'gym_db'}`;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Database] PostgreSQL Connected successfully via Sequelize.');
    require('../models');
    await sequelize.sync();
    console.log('[Database] PostgreSQL tables synchronized successfully.');
  } catch (error) {
    console.error(`[Database Error] Unable to connect to PostgreSQL: ${error.message}`);
  }
};

module.exports = { sequelize, connectDB };
