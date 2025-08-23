const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,   // habit_db
  process.env.DB_USER,   // root
  process.env.DB_PASS,   // Sanmitha@123 (from .env)
  {
    host: process.env.DB_HOST,  // localhost
    dialect: 'mysql'
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Error: ' + err));

module.exports = sequelize;
