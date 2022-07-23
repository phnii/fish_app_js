const express = require('express');
const router = express.Router();
const tripsController = require("../controllers/tripsController");

router.get("/", tripsController.index, tripsController.indexView);
router.get("/new", tripsController.new);
router.post("/create", tripsController.create, tripsController.redirectView);
router.post("/update/:id", tripsController.update, tripsController.redirectView);
router.get("/:id/edit", tripsController.edit);

router.get("/:id", tripsController.show, tripsController.showView);

module.exports = router;
