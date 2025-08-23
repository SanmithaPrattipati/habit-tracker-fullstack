const Habit = require("../models/habitModel");

// ➕ Add habit
exports.addHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;
    const habit = await Habit.create({ name, frequency });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: "Failed to add habit" });
  }
};

// 📋 Get all habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.findAll();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

// 🔄 Update habit (toggle complete)
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    const { name, frequency, completed } = req.body;

    if (name) habit.name = name;
    if (frequency) habit.frequency = frequency;

    if (completed !== undefined) {
      habit.completed = completed;
      habit.streak = completed ? habit.streak + 1 : Math.max(habit.streak - 1, 0);
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ❌ Delete habit
exports.deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findByPk(id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    await habit.destroy();
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
};
