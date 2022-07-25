const express = require("express");
const router = express.Router();

const roomsController = require("../controllers/roomsController");
const usersController = require("../controllers/usersController");

router.post("/create", roomsController.beforeCreate, roomsController.create, usersController.redirectView);
router.get("/:id", roomsController.index);

module.exports = router;