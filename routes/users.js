const express = require('express');
const router = express.Router();
const usersController = require("../controllers/users");

/* GET users listing. */
router.get("/new", usersController.new);
router.post("/create", usersController.create, usersController.redirectView);
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate, usersController.redirectView);
router.get("/:id", usersController.show, usersController.showView);

module.exports = router;
