const express = require("express");
const router = express.Router();
const newsControlller = require("../controllers/news.controller");

router.get("/", newsControlller.getAllNews);
router.get("/:id", newsControlller.getOneNew);
router.post("/", newsControlller.createNew);
router.put("/:id", newsControlller.updateNew);
router.delete("/:id", newsControlller.deleteNew);

module.exports = router;
