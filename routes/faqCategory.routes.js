const express = require("express");
const router = express.Router();
const faqCategoryController = require("../controllers/faqCategory.controller");

router.get("/", faqCategoryController.getAllFaqCategory);

router.get("/:id", faqCategoryController.getOneFaqCategory);

router.post("/", faqCategoryController.createOneFaqCategory);

router.put("/:id", faqCategoryController.updateOneFaqCategory);

router.delete("/:id", faqCategoryController.deleteOneCategory);

module.exports = router;
