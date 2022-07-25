const express = require("express");
const router = express.Router();

const roomsController = require("../controllers/roomsController");
const usersController = require("../controllers/usersController");

router.post("/create", roomsController.beforeCreate, roomsController.create, usersController.redirectView);
router.post("/:id/sendMessage", roomsController.sendMessage, roomsController.redirectView);
router.get("/:id", roomsController.index, roomsController.indexView);

module.exports = router;