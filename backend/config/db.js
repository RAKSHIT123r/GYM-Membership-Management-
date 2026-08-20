require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const connectionString = process.env.POSTGRES_URI;

if (!connectionString) {
  throw new Error('POSTGRES_URI environment variable is not set');
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectModule: pg,
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
