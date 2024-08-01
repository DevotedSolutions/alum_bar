const express = require("express");
const jobsheetcontrl = require("../controller/job-sheets-controller");

const router = express.Router();

router.post("/add-jobsheet", jobsheetcontrl.addJobSheet);
router.post("/add-frappejs", jobsheetcontrl.addFrappeJS);
router.get("/all-jobsheets", jobsheetcontrl.getAllJobSheets);
router.get("/frappejs/:jobSheetId", jobsheetcontrl.getFrappeJSByJobSheet);
router.get("/sum-frappejs/:jobSheetId", jobsheetcontrl.getJobsheetSum);
router.post("/frappe-pro-acc", jobsheetcontrl.getFrappeProfilesAcc);
router.post("/optimizeProfile", jobsheetcontrl.getOptimizedJobSheet);
module.exports = router;
