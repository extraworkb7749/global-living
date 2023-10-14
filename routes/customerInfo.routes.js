const express = require("express");
const router = express.Router();
const customerInfo = require("../controllers/customerinfo.controller");

router.get("/", customerInfo.getAllCustomerInfo);
router.get("/:id", customerInfo.getOneCustomerInfo);
router.post("/", customerInfo.takeCustomerInfo);
router.put("/:id", customerInfo.updateCustomerInfo);
router.delete("/:id", customerInfo.deleteCustomerInfo);
module.exports = router;
