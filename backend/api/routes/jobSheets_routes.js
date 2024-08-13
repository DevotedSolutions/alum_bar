const express = require("express");
const jobsheetcontrl = require("../controller/job-sheets-controller");

const router = express.Router();

router.get("/all-jobsheets", jobsheetcontrl.getAllJobSheets);
router.post("/add-jobsheet", jobsheetcontrl.addJobSheet);
router.delete("/delete-jobsheet/:jobSheetId", jobsheetcontrl.deleteJobSheet);
router.post("/add-frappejs", jobsheetcontrl.addFrappeJS);
router.post("/update-frappejs", jobsheetcontrl.updateFrappeJS);
router.delete("/delete-jobsheet/:type/:jobSheetId", jobsheetcontrl.deleteSheet);
router.get("/onefrappejs/:sheetID", jobsheetcontrl.getOneFrappeJSByID);
router.get("/frappejs/:jobSheetId", jobsheetcontrl.getFrappeJSByJobSheet);
router.get("/sum-frappejs/:jobSheetId", jobsheetcontrl.getJobsheetSum);
router.post("/frappe-pro-acc", jobsheetcontrl.getFrappeProfilesAcc);
router.post("/optimizeProfile", jobsheetcontrl.getOptimizedJobSheet);
router.get("/export-to-excel/:jobSheetId", jobsheetcontrl.exporttoExcel);
router.get("/export-to-pdf/:jobSheetId", jobsheetcontrl.exporttoPDF);

module.exports = router;
