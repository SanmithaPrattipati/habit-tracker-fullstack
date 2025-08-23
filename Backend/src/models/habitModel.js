const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Habit = sequelize.define("Habit", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  frequency: {
    type: DataTypes.ENUM("Daily", "Weekly", "Monthly"),
    allowNull: false,
    defaultValue: "Daily",
  },
   streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Habit;
