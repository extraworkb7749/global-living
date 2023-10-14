const express = require("express");
const router = express.Router();
const newsDetailController = require("../controllers/newsDetail.controller");

router.get("/", newsDetailController.getAllNewsDetail);
router.get("/:id", newsDetailController.getOneNewDetail);
router.post("/", newsDetailController.createNewDetail);
router.put("/:id", newsDetailController.updateNewDetail);
router.delete("/:id", newsDetailController.deleteNewDetail);

module.exports = router;
