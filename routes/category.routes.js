const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/", categoryController.getAllCategory1);

router.post("/", categoryController.addCategory1);

router.post("/detail", categoryController.getCategoryListDetail);

router.get("/:id", categoryController.getOneCategory);

router.put("/:id", categoryController.updateCategory1);

router.delete("/:id", categoryController.deleteCategory1);

module.exports = router;
