const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepage.controller");
router.get("/", homepageController.getAllHomepage);
router.get("/:id", homepageController.getOneHomepage);
router.post("/", homepageController.createOneHomepage);
router.put("/:id", homepageController.updateOneHomepage);
router.delete("/:id", homepageController.deleteOne);

module.exports = router;
