import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFrequency, setEditFrequency] = useState("Daily");

  // Fetch habits
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/habits")
      .then((res) => setHabits(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add habit
  const addHabit = () => {
    if (!newHabit.trim()) return alert("Please enter a habit!");

    axios
      .post("http://localhost:5000/api/habits", { name: newHabit, frequency })
      .then((res) => {
        setHabits([...habits, res.data]);
        setNewHabit("");
        setFrequency("Daily");
      })
      .catch((err) => console.error(err));
  };

  // Toggle complete
  const toggleComplete = (habit) => {
    axios
      .put(`http://localhost:5000/api/habits/${habit.id}`, {
        completed: !habit.completed,
        streak: habit.completed ? habit.streak - 1 : habit.streak + 1, // update streak
      })
      .then((res) => {
        setHabits(habits.map((h) => (h.id === habit.id ? res.data : h)));
      })
      .catch((err) => console.error(err));
  };

  // Start editing
  const startEdit = (habit) => {
    setEditId(habit.id);
    setEditText(habit.name);
    setEditFrequency(habit.frequency);
  };

  // Save edit
  const saveEdit = (id) => {
    axios
      .put(`http://localhost:5000/api/habits/${id}`, {
        name: editText,
        frequency: editFrequency,
      })
      .then((res) => {
        setHabits(habits.map((h) => (h.id === id ? res.data : h)));
        setEditId(null);
        setEditText("");
        setEditFrequency("Daily");
      })
      .catch((err) => console.error(err));
  };

  // Delete habit
  const deleteHabit = (id) => {
    axios
      .delete(`http://localhost:5000/api/habits/${id}`)
      .then(() => setHabits(habits.filter((h) => h.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-orange-500 p-6 text-white relative overflow-hidden">
      {/* Sparkle Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_40%)] animate-pulse"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-lg">
          🌟 Habit Tracker
        </h1>

        {/* Add Habit */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-6 rounded-2xl shadow-xl mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Add a New Habit</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="px-4 py-2 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <button
              onClick={addHabit}
              className="px-6 py-2 bg-white text-pink-600 font-bold rounded-xl shadow hover:bg-yellow-100 transition"
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Habit List */}
        <ul className="grid md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const percent = Math.min((habit.streak / 30) * 100, 100);
            return (
              <li
                key={habit.id}
                className="flex flex-col bg-white/20 backdrop-blur-lg shadow-lg rounded-xl p-5 hover:shadow-2xl transition"
              >
                {editId === habit.id ? (
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Edit Name */}
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="px-3 py-2 rounded-lg border text-black"
                    />

                    {/* Edit Frequency */}
                    <select
                      value={editFrequency}
                      onChange={(e) => setEditFrequency(e.target.value)}
                      className="px-3 py-2 rounded-lg border text-black"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(habit.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <FaCheck /> Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="font-bold text-lg flex items-center gap-2">
                      {habit.name}
                      <span className="text-sm text-gray-200">
                        ({habit.frequency})
                      </span>
                    </p>
                    <p className="text-sm">🔥 Streak: {habit.streak} days</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-100 mt-1">
                      {percent.toFixed(0)}% complete
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => toggleComplete(habit)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-white ${
                      habit.completed
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {habit.completed ? "Undo" : "Done"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(habit)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Overall Progress Chart */}
        <div className="w-full bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg mt-12">
          <h2 className="text-2xl font-bold mb-4">📊 Habit Progress Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={habits}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="streak" fill="#ff80b5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
