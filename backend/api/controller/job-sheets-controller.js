const jobSheetSchema = require("../model/jobsheetSchema");
const frappeJSSchema = require("../model/frappeJobSheetSchema");
const { getPSP1Data } = require("./frappeProducts/psp1");
const { getSOU1Data } = require("./frappeProducts/sou1");
const { getPE2Data } = require("./frappeProducts/pe2");
const { getPF1Data } = require("./frappeProducts/pf1");
const { getVB2Data } = require("./frappeProducts/vb2");

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
    handleHeight,
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
      (!title,
      !jobSheet,
      !client,
      !projet,
      !repere,
      !handleDirection,
      !handleHeight,
      !lang,
      !jointCovers,
      !threshold,
      !closing,
      !windowRef,
      !glazzing,
      !quantity,
      !profiles,
      !accessories,
      !glazzingValues,
      !height,
      !width)
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
    } else if (windowRef === "PSP 1") {
      const data = getPSP1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "SO 1") {
      const data = getSOU1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PE 2") {
      const data = getPE2Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PF 1") {
      const data = getPF1Data({ ...req.body });
      res.status(200).json({ ...data });
    } else if (windowRef === "PF 2") {
      const data = getVB2Data({ ...req.body });
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
    const BAR_LENGTH = 5795;
    const optimizedSheet1 = JobSheetOptimizationAlgo1(
      deepCopyProfiles(profiles),
      BAR_LENGTH
    );
    const optimizedSheet2 = JobSheetOptimizationAlgo2(
      deepCopyProfiles(profiles),
      BAR_LENGTH
    );

    let totalWastage1 = optimizedSheet1.reduce((sum, profile) => {
      return sum + (profile.Wastage < 700 ? profile.Wastage : 0);
    }, 0);
    let totalWastage2 = optimizedSheet2.reduce((sum, profile) => {
      return sum + (profile.Wastage < 700 ? profile.Wastage : 0);
    }, 0);

    let totalUsage1 = optimizedSheet1.reduce((sum, profile) => {
      return sum + profile.Total;
    }, 0);
    let totalUsage2 = optimizedSheet2.reduce((sum, profile) => {
      return sum + profile.Total;
    }, 0);

    const optimizedSheet =
      totalUsage1 < totalUsage2
        ? optimizedSheet1
        : totalUsage2 < totalUsage1
        ? optimizedSheet2
        : totalWastage1 > totalWastage2
        ? optimizedSheet2
        : optimizedSheet1;

    res.status(200).json([...optimizedSheet]);
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

function JobSheetOptimizationAlgo1(profiles, BAR_LENGTH) {
  const MIN_WASTE = 100;

  // Sort profiles by descending length
  profiles.sort((a, b) => b.length - a.length);

  let result = [];
  let remainingProfiles = [...profiles];

  while (remainingProfiles.length > 0) {
    let currentBar = {
      num: result.length + 1,
      Total: BAR_LENGTH + 5,
      Wastage: 0,
      Bars: [],
    };

    let currentLength = BAR_LENGTH;
    let cutBars = [];

    let tempNum = null;

    for (let i = 0; i < remainingProfiles.length; i++) {
      let profile = remainingProfiles[i];
      let length = profile.length + 5;

      while (profile.quantity > 0 && length <= currentLength) {
        if (
          currentLength < MIN_WASTE ||
          currentLength < remainingProfiles[remainingProfiles.length - 1].length
        ) {
          break;
        }

        if (currentLength - length < MIN_WASTE) {
          let qty = Math.min(
            profile.quantity,
            Math.floor(currentLength / length)
          );
          if (qty > 0) {
            currentLength -= length * qty;
            profile.quantity -= qty;
            cutBars.push({ Length: length - 5, Quantity: qty });
          }
        } else if (
          currentLength - length > MIN_WASTE &&
          currentLength - length >
            remainingProfiles[remainingProfiles.length - 1].length
        ) {
          let qty = Math.min(
            profile.quantity,
            Math.floor(currentLength / length)
          );
          if (qty > 0) {
            currentLength -= length * qty;
            profile.quantity -= qty;
            cutBars.push({ Length: length - 5, Quantity: qty });
          }
        } else if (profile.quantity > 0 && length < currentLength) {
          if (tempNum) {
            let profileT = remainingProfiles[tempNum];
            if (profileT.length > currentLength) {
              tempNum = i;
            } else {
              tempNum = Math.min(tempNum, i);
            }
          } else {
            tempNum = i;
          }
        }
        if (i === remainingProfiles.length - 1 && tempNum !== null) {
          let profileL = remainingProfiles[tempNum];
          let lengthL = profileL.length + 5;
          let qty = Math.min(
            profileL.quantity,
            Math.floor(currentLength / lengthL)
          );
          if (qty > 0) {
            currentLength -= lengthL * qty;
            profileL.quantity -= qty;
            cutBars.push({ Length: lengthL - 5, Quantity: qty });
          }

          break;
        }
        break;
      }
    }

    // Remove fully cut profiles
    remainingProfiles = remainingProfiles.filter(
      (profile) => profile.quantity > 0
    );

    currentBar.Bars = cutBars;
    currentBar.Wastage = currentLength;
    result.push(currentBar);
  }

  return result;
}
function JobSheetOptimizationAlgo2(profiles, BAR_LENGTH) {
  let totalLength = profiles.reduce((sum, profile) => {
    return sum + (profile.length + 5) * profile.quantity;
  }, 0);

  let minBars = Math.ceil(totalLength / BAR_LENGTH);

  for (let i = 0; i < profiles.length; i++) {
    let adjustedLength = totalLength - (profiles[i].length + 5);
    let barsNeeded = Math.ceil(adjustedLength / BAR_LENGTH);

    if (barsNeeded <= minBars - 1) {
      let remainingProfiles = profiles
        .map((p, index) => {
          if (index === i && p.quantity > 1) {
            return { ...p, quantity: p.quantity - 1 };
          } else if (index !== i) {
            return { ...p };
          }
        })
        .filter((val) => val);

      let result = JobSheetOptimizationAlgo1(remainingProfiles, BAR_LENGTH);

      if (result.length <= minBars - 1) {
        return [
          ...result,
          {
            num: minBars,
            Total: BAR_LENGTH + 5,
            Wastage: 5795 - profiles[i].length,
            Bars: [
              {
                Length: profiles[i].length,
                Quantity: 1,
              },
            ],
          },
        ];
      }
    }
  }

  return JobSheetOptimizationAlgo1(profiles, BAR_LENGTH);
}
