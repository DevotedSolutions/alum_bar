const jobSheetSchema = require("../model/jobsheetSchema");
const frappeJSSchema = require("../model/frappeJobSheetSchema");
const { getPSP1Data } = require("./frappeProducts/psp1");
const { getSOU1Data } = require("./frappeProducts/sou1");
const { getPE2Data } = require("./frappeProducts/pe2");

exports.getAllJobSheets = async (req, res) => {
  try {
    const jobSheets = await jobSheetSchema.find({});
    res.status(200).json(jobSheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFrappeJSByJobSheet = async (req, res) => {
  const { jobSheetId } = req.params;

  try {
    const frappeJS = await frappeJSSchema.find({ jobSheet: jobSheetId });
    if (!frappeJS.length) {
      return res.status(404).json({
        message: "No FrappeJS documents found for the provided JobSheet ID",
      });
    }
    res.status(200).json(frappeJS);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addJobSheet = async (req, res) => {
  const { type } = req.body;

  try {
    if (!type) {
      return res.status(400).json({ message: "Type is missing!" });
    }

    const jobsheet_data = new jobSheetSchema({
      type,
    });

    const result = await jobsheet_data.save();
    res.status(200).json({ message: "Job Sheet added successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFrappeJS = async (req, res) => {
  const {
    title,
    jobSheet,
    client,
    projet,
    repere,
    handleDirection,
    lang,
    jointCovers,
    threshold,
    closing,
    windowRef,
    quantity,
    width,
    height,
    glazzing,
  } = req.body;

  try {
    if (
      (!title,
      !jobSheet,
      !handleDirection,
      !lang,
      !jointCovers,
      !threshold,
      !closing,
      !windowRef,
      !quantity,
      !height,
      !width)
    ) {
      return res.status(400).json({ message: "Data is missing!" });
    }

    const frappeJS_data = new frappeJSSchema({
      title,
      jobSheet,
      client,
      projet,
      repere,
      handleDirection,
      lang,
      jointCovers,
      threshold,
      closing,
      windowRef,
      quantity,
      width,
      height,
      glazzing,
    });

    const result = await frappeJS_data.save();
    res.status(200).json({ message: "FrappeJS added successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFrappeProfilesAcc = async (req, res) => {
  const {
    windowRef,
    height,
    width,
    quantity,
    glazzing,
    color,
    jointCovers,
    lang,
    threshold,
    closing,
    basement,
    blade,
  } = req.body;

  try {
    if (
      !windowRef ||
      !height ||
      !width ||
      !glazzing ||
      !color ||
      !quantity ||
      !jointCovers ||
      !lang ||
      !threshold ||
      !closing ||
      !basement ||
      !blade
    ) {
      return res.status(400).json({ message: "Some Data is missing!" });
    } else if (windowRef === "PSP 1") {
      const data = getPSP1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "SO 1") {
      const data = getSOU1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else {
      const data = getPE2Data({ ...req.body });
      res.status(200).json({ ...data });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
