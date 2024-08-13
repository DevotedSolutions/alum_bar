function deepCopyProfiles(profiles) {
  return profiles.map((profile) => ({
    ...profile,
    quantity: profile.quantity,
  }));
}

exports.optimizeJobSheet = (profiles) => {
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

  return optimizedSheet;
};

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
