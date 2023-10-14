const express = require("express");
const router = express.Router();
const faqQuestionController = require("../controllers/faqQuestion.controller");

router.get("/", faqQuestionController.getAllQuestions);
router.get("/:id", faqQuestionController.getOneFaqQuestion);
router.post("/", faqQuestionController.createOneQuestion);
router.put("/:id", faqQuestionController.updateOneQuestion);
router.delete("/:id", faqQuestionController.deleteOneQuestion);

module.exports = router;
