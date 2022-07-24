const express = require('express');
const router = express.Router();
const usersController = require("../controllers/usersController");

/* GET users listing. */
router.get("/new", usersController.new);
router.post("/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);
router.post("/follow/:id", usersController.follow, usersController.redirectView);
router.post("/unfollow/:id", usersController.unfollow, usersController.redirectView)
router.get("/:id/followers", usersController.followers, usersController.followersView);
router.get("/:id", usersController.show, usersController.showView);

module.exports = router;
