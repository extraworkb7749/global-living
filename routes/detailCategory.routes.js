const express = require("express");
const router = express.Router();
const detailCategoryController = require("../controllers/detailCategory1.controller");

router.get("/", detailCategoryController.getAllDetail);
router.get("/:id", detailCategoryController.getOneDetail);
router.post("/", detailCategoryController.createDetailCategory);
router.put("/:id", detailCategoryController.updateDetailCategory);
router.delete("/:id", detailCategoryController.deleteDetailCategory);
module.exports = router;
