const express = require('express');
const router = express.Router();
const tripsController = require("../controllers/tripsController");
const commentsController = require("../controllers/commentsController");

router.get("/", tripsController.index, tripsController.indexView);
router.get("/search", tripsController.search, tripsController.searchView);
router.post("/search", tripsController.search, tripsController.searchView);
router.get("/new", tripsController.new);
router.post("/create",tripsController.validate, tripsController.create, tripsController.redirectView);
router.get("/edit/:id",tripsController.edit);
router.post("/update/:id",tripsController.validate, tripsController.update, tripsController.redirectView);
router.post("/:id/comment", commentsController.create, tripsController.redirectView);
router.delete("/:id/comment/:commentId/delete", commentsController.delete, tripsController.redirectView);
router.delete("/:id/delete", tripsController.delete, tripsController.redirectView);

router.get("/:id", tripsController.show, tripsController.showView);

module.exports = router;
