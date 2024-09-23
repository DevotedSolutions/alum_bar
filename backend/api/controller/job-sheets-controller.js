const { exportToPDF } = require("./frappeProducts/exportPDF");
const { exporttoXLSX } = require("./frappeProducts/exportToXLSX");
const jobSheetSchema = require("../model/jobsheetSchema");
const frappeJSSchema = require("../model/frappeJobSheetSchema");
const { getPSP1Data } = require("./frappeProducts/psp1");
const { getSOU1Data } = require("./frappeProducts/sou1");
const { getPE2Data } = require("./frappeProducts/pe2");
const { getPF1Data } = require("./frappeProducts/pf1");
const { getVB2Data } = require("./frappeProducts/vb2");
const { getF1Data } = require("./frappeProducts/f1");
const { optimizeJobSheet } = require("./frappeProducts/optimize");
const { getF2Data } = require("./frappeProducts/f2");
const { getF3Data } = require("./frappeProducts/f3");
const { getF4Data } = require("./frappeProducts/f4");
const { getOF1Data } = require("./frappeProducts/of1");
const { getOF2Data } = require("./frappeProducts/of2");
const { getSOU2Data } = require("./frappeProducts/sou2");
const { getVB1Data } = require("./frappeProducts/vb1");
const { getPOB1Data } = require("./frappeProducts/pob1");
const { getPOB2Data } = require("./frappeProducts/pob2");
const { getPOBE1Data } = require("./frappeProducts/pobe1");
const { getPOBE2Data } = require("./frappeProducts/pobe2");
const { getFPData } = require("./frappeProducts/fp");
const { getPSP2Data } = require("./frappeProducts/psp2");
const { getVP1Data } = require("./frappeProducts/vp1");
const { getVP2Data } = require("./frappeProducts/vp2");
const { getPE1Data } = require("./frappeProducts/pe1");
const { getPE2TraData } = require("./frappeProducts/pe2-tra");
const { getPCV1Data } = require("./frappeProducts/pcv1");
const { getPCV2Data } = require("./frappeProducts/pcv2");
const { getPCVHaut1Data } = require("./frappeProducts/pcv-haut1");
const { getPCVHaut2Data } = require("./frappeProducts/pcv-haut2");
const { getPCP1Data } = require("./frappeProducts/pcp");
const { getPCP2Data } = require("./frappeProducts/pcp2");

exports.getAllJobSheets = async (req, res) => {
  try {
    const jobSheets = await jobSheetSchema.find({});

    const jobSheetsWithCounts = await Promise.all(
      jobSheets.map(async (jobSheet) => {
        const relatedSheets = await frappeJSSchema.find({
          jobSheet: jobSheet._id,
        });
        return {
          ...jobSheet._doc,
          numberOfSheets: relatedSheets.length,
        };
      })
    );

    res.status(200).json(jobSheetsWithCounts);
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

exports.getOneFrappeJSByID = async (req, res) => {
  const { sheetID } = req.params;

  try {
    const frappeJS = await frappeJSSchema.find({ _id: sheetID });

    if (!frappeJS.length) {
      return res.status(404).json({
        message: "No FrappeJS documents found for the provided  ID",
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

exports.deleteJobSheet = async (req, res) => {
  const id = req.params.jobSheetId;

  try {
    if (!id) {
      return res.status(400).json({ message: "please provide jobSheetId !!" });
    }
    let doc = await jobSheetSchema.findByIdAndDelete(id);
    if (!doc) {
      return res.status(400).json({ message: "Could not find a product." });
    }
    res.status(200).json({ message: "Product  deleted successfully", doc });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteSheet = async (req, res) => {
  const id = req.params.jobSheetId;
  const type = req.params.type;

  try {
    if (!id) {
      return res.status(400).json({ message: "please provide jobSheetId !!" });
    }
    if (type === "frappe") {
      let doc = await frappeJSSchema.findByIdAndDelete(id);
      if (!doc) {
        return res.status(400).json({ message: "Could not find a product." });
      }
      res.status(200).json({ message: "Product  deleted successfully", doc });
    } else {
      res.status(500).json({ message: "Job sheet type is not correct.", doc });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.addFrappeJS = async (req, res) => {
  const {
    title,
    jobSheet,

    lang,
    jointCovers,
    threshold,
    closing,
    windowRef,
    quantity,
    width,
    height,
    glazzing,
    profiles,
    accessories,
    glazzingValues,
  } = req.body;

  try {
    if (
      !title ||
      !jobSheet ||
      !lang ||
      !jointCovers ||
      !threshold ||
      !closing ||
      !windowRef ||
      !glazzing ||
      !quantity ||
      !profiles ||
      !accessories ||
      !glazzingValues ||
      !height ||
      !width
    ) {
      return res.status(400).json({ message: "Data is missing!" });
    }

    const frappeJS_data = new frappeJSSchema({
      ...req.body,
    });

    const result = await frappeJS_data.save();
    res.status(200).json({ message: "FrappeJS added successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFrappeJS = async (req, res) => {
  const {
    _id,
    title,
    jobSheet,
    lang,
    jointCovers,
    threshold,
    closing,
    windowRef,
    quantity,
    width,
    height,
    glazzing,
    profiles,
    accessories,
    glazzingValues,
  } = req.body;

  try {
    if (
      !_id ||
      !title ||
      !jobSheet ||
      !lang ||
      !jointCovers ||
      !threshold ||
      !closing ||
      !windowRef ||
      !glazzing ||
      !quantity ||
      !profiles ||
      !accessories ||
      !glazzingValues ||
      !height ||
      !width
    ) {
      return res.status(400).json({ message: "Data is missing!" });
    }

    const result = await frappeJSSchema.findByIdAndUpdate(
      _id,
      {
        ...req.body,
      },
      { new: true, runValidators: true } // Returns the updated document and runs validation
    );

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
      !basement
    ) {
      return res.status(400).json({ message: "Some Data is missing!" });
    } else if (windowRef === "F1") {
      const data = getF1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "F2") {
      const data = getF2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "F3") {
      const data = getF3Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "F4") {
      const data = getF4Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "OF1") {
      const data = getOF1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "OF2") {
      const data = getOF2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PSP 1") {
      const data = getPSP1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PSP 2") {
      const data = getPSP2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "SO 1") {
      const data = getSOU1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "SO 2") {
      const data = getSOU2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PE 2") {
      const data = getPE2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PE 2 Tra") {
      const data = getPE2TraData({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PE 1") {
      const data = getPE1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PCV 1") {
      const data = getPCV1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PCV 2") {
      const data = getPCV2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PF 1") {
      const data = getPF1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PF 2") {
      const data = getVB2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "FP") {
      const data = getFPData({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "VB 1") {
      const data = getVB1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "VP 1") {
      const data = getVP1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "VP 2") {
      const data = getVP2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "POB 1") {
      const data = getPOB1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "POB E1") {
      const data = getPOBE1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "POB 2") {
      const data = getPOB2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "POB E2") {
      const data = getPOBE2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PCV Haut1") {
      const data = getPCVHaut1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PCV Haut2") {
      const data = getPCVHaut2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PCP 1") {
      const data = getPCP1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PCP 2") {
      const data = getPCP2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else {
      return res
        .status(404)
        .json({ message: "WindowRef Value is not correct" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobsheetSum = async (req, res) => {
  const { jobSheetId } = req.params;

  try {
    const frappeJS = await frappeJSSchema.find({ jobSheet: jobSheetId });
    if (!frappeJS.length) {
      return res.status(404).json({
        message: "No FrappeJS documents found for the provided JobSheet ID",
      });
    }

    const sumVT = calculateAllGlazzingQuantities(frappeJS);
    const sumAcc = calculateAllAccessoryQuantities(frappeJS);
    const sumProfiles = calculateAllProfileQuantities(frappeJS);

    res.status(200).json({
      sumVT,
      sumAcc,
      sumProfiles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function deepCopyProfiles(profiles) {
  return profiles.map((profile) => ({
    ...profile,
    quantity: profile.quantity,
  }));
}

exports.getOptimizedJobSheet = async (req, res) => {
  const { profiles } = req.body;

  try {
    const optimizedSheet = optimizeJobSheet(profiles);

    res.status(200).json([...optimizedSheet]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exporttoPDF = async (req, res) => {
  const { jobSheetId } = req.params;

  try {
    const frappeJSObjects = await frappeJSSchema.find({ jobSheet: jobSheetId });
    if (!frappeJSObjects.length) {
      return res.status(404).json({
        message: "No FrappeJS documents found for the provided JobSheet ID",
      });
    }

    const optimizedSheet = exportToPDF(
      jobSheetId,
      frappeJSObjects,
      calculateAllGlazzingQuantities(frappeJSObjects),
      calculateAllAccessoryQuantities(frappeJSObjects),
      calculateAllProfileQuantities(frappeJSObjects)
    );

    res.status(200).json(optimizedSheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exporttoExcel = async (req, res) => {
  const { jobSheetId } = req.params;

  try {
    const frappeJSObjects = await frappeJSSchema.find({ jobSheet: jobSheetId });
    if (!frappeJSObjects.length) {
      return res.status(404).json({
        message: "No FrappeJS documents found for the provided JobSheet ID",
      });
    }

    const optimizedSheet = exporttoXLSX(
      jobSheetId,
      frappeJSObjects,
      calculateAllGlazzingQuantities(frappeJSObjects),
      calculateAllAccessoryQuantities(frappeJSObjects),
      calculateAllProfileQuantities(frappeJSObjects)
    );

    res.status(200).json(optimizedSheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateAllGlazzingQuantities(jobSheets) {
  try {
    // Map to store the total quantities for each accessory code
    const glazzingQuantities = new Array();

    // Iterate through all job sheets and accessories to sum quantities
    jobSheets.forEach((jobSheet) => {
      glazzingQuantities?.push({
        id: jobSheet?._id,
        quantity: jobSheet?.quantity,
        width: jobSheet?.width,
        height: jobSheet?.height,
        glazzing: jobSheet?.glazzing,
        repere: jobSheet?.repere,
        glazzingValues: jobSheet?.glazzingValues,
      });
    });

    return glazzingQuantities;
  } catch (error) {
    console.error("Error calculating glazzing quantities:", error);
    throw error;
  }
}

function calculateAllAccessoryQuantities(jobSheets) {
  try {
    // Map to store the total quantities for each accessory code
    const accessoryQuantities = new Map();

    // Iterate through all job sheets and accessories to sum quantities
    jobSheets.forEach((jobSheet) => {
      jobSheet.accessories.forEach((accessory) => {
        if (accessory.code) {
          if (!accessoryQuantities.has(accessory.code)) {
            accessoryQuantities.set(accessory.code, {
              name: accessory.name,
              code: accessory.code,
              sum: 0,
              list: [],
            });
          }
          accessoryQuantities.get(accessory.code).sum += accessory.quantity;
          accessoryQuantities.get(accessory.code).list = [
            ...accessoryQuantities.get(accessory.code).list,
            accessory.quantity,
          ]
            .sort((a, b) => a - b)
            ?.filter((val) => val > 0);
        }
      });
    });

    // Convert the map to an array of objects
    const result = Array.from(accessoryQuantities.values());

    return result;
  } catch (error) {
    console.error("Error calculating accessory quantities:", error);
    throw error;
  }
}

function calculateAllProfileQuantities(jobSheets) {
  try {
    // Map to store the total quantities for each accessory code
    const profileQuantities = new Map();

    // Iterate through all job sheets and accessories to sum quantities
    jobSheets.forEach((jobSheet) => {
      jobSheet.profiles.forEach((profile) => {
        if (profile.code) {
          if (
            !profileQuantities.has(
              `${profile.code}-${profile.param}-${profile.length}`
            )
          ) {
            profileQuantities.set(
              `${profile.code}-${profile.param}-${profile.length}`,
              {
                name: profile.name,
                code: profile.code,
                color: profile.color,
                param: profile.param,
                length: profile.length,
                quantity: 0,
              }
            );
          }
          profileQuantities.get(
            `${profile.code}-${profile.param}-${profile.length}`
          ).quantity += profile.quantity;
        }
      });
    });

    const result = Array.from(profileQuantities.values())
      .sort((a, b) => {
        // First, sort by the `code` string lexicographically
        const codeComparison = a.code.localeCompare(b.code);

        // If `code` strings are equal, sort by the length of `code`
        if (codeComparison === 0) {
          return a.length - b.length;
        }

        return codeComparison;
      })
      .filter((a) => a.quantity > 0 && a.length > 0);

    return result;
  } catch (error) {
    console.error("Error calculating profile quantities:", error);
    throw error;
  }
}
