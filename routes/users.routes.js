const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getOneUser);

router.post("/", usersController.createNewUser);

router.post("/login", usersController.signInExistingUser);

router.put("/:id", usersController.updateUser);

router.delete("/:id", usersController.deleteUser);

module.exports = router;
