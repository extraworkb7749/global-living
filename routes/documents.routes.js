const express = require("express");

const router = express.Router();

const documentsController = require("../controllers/documents1.controller");

router.get("/", documentsController.getAllDocuments);

router.post("/", documentsController.createDocuments);

router.get("/:id", documentsController.getOneDocument);

router.put("/:id", documentsController.updateDocument);

router.delete("/:id", documentsController.deleteDocument);

module.exports = router;
