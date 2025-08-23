const express = require("express");
const router = express.Router();
const {
  addHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitControllers");

router.post("/", addHabit);
router.get("/", getHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

module.exports = router;
