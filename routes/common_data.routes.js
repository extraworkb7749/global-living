const express = require("express");
const router = express.Router();
const commonDataController = require("../controllers/common_data.controller");

router.get("/", commonDataController.getAllCommonData);

router.post("/", commonDataController.addCommonData);

router.get("/:id", commonDataController.getOneCommonData);

router.put("/:id", commonDataController.updateCommonData);

router.delete("/:id", commonDataController.deleteCommonData);

module.exports = router;
