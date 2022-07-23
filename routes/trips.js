const express = require('express');
const router = express.Router();
const tripsController = require("../controllers/tripsController");

router.get("/", tripsController.index, tripsController.indexView);
router.get("/new", tripsController.new);
router.post("/create", tripsController.create, tripsController.redirectView);

module.exports = router;
