const dataset = require("../frappeDataset.json");

exports.getPOBE2Data = ({
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
  thirdParty,
  thirdPartyValue,
}) => {
  const profiles = dataset?.profiles || [];
  const accessories = dataset?.accessories || [];

  const jointCoverOffset = jointCovers === "yes";
  const thresholdOffset = threshold === "yes";
  const basementOffset = basement === "yes";
  const thirdPartyOffset = thirdParty === "yes";
  const langIsEN = lang === "EN";

  const P38 = jointCoverOffset ? height + 18 : height;
  let O32 = jointCoverOffset ? width - 36 : width - 54;
  const P50 = thirdPartyOffset ? thirdPartyValue : O32;
  const P51 = O32 - P50;
  const P52 =
    height -
    (jointCoverOffset
      ? thresholdOffset
        ? 22
        : 30
      : thresholdOffset
      ? 31
      : 48);
  const H51 = blade * 120;

  const R41 =
    ((thresholdOffset ? quantity : quantity * 2) *
      (jointCoverOffset ? width + 36 : width)) /
    1000;
  const R42 =
    (quantity * 2 * (!thresholdOffset && jointCoverOffset ? P38 + 18 : P38)) /
    1000;
  const S41 = (R41 + R42) * 1.07;

  const R51 = (quantity * 4 * P50) / 1000;
  const R52 = (quantity * 2 * P51) / 1000;
  const R53 = (quantity * 2 * P52) / 1000;
  const R54 = (quantity * 2 * (H51 + 140)) / 1000;
  const R541 = (quantity * 2 * (P52 - 140 - H51)) / 1000;
  const S50 = (R51 + R52 + R53 + R54 + R541) * 1.07;

  const R55 = (quantity * 4 * (P50 - 140)) / 1000;
  const R56 = (quantity * 4 * (P51 - 140)) / 1000;
  const R57 = (quantity * 4 * (P52 - 280 - H51)) / 1000;
  const R58 = (quantity * 2 * H51) / 1000;
  const R59 = (quantity * 2 * (H51 + 100)) / 1000;
  const S56 = (R55 + R56 + R57 + R58 + R59) * 1.07;

  const glazzingVal = getGlazzingVal(glazzing);

  return {
    profiles: [
      {
        name: profiles[jointCoverOffset ? 1 : 0]?.name,
        code: profiles[jointCoverOffset ? 1 : 0]?.code,
        color,
        param: "Width",
        quantity: thresholdOffset ? quantity : quantity * 2,
        length: jointCoverOffset ? width + 36 : width,
        next: "45/45",
      },
      {
        name: profiles[jointCoverOffset ? 1 : 0]?.name,
        code: profiles[jointCoverOffset ? 1 : 0]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: !thresholdOffset && jointCoverOffset ? P38 + 18 : P38,
        next: thresholdOffset ? "90/45 45/90" : "45/45",
      },

      {
        name: profiles[3]?.name,
        code: profiles[3]?.code,
        color,
        param: "Width",
        quantity: quantity,
        length: P51 - 140,
      },

      {
        name: profiles[4]?.name,
        code: profiles[4]?.code,
        color,
        param: "Height",
        quantity: quantity,
        length: P50 - 53,
      },
      {
        name: profiles[4]?.name,
        code: profiles[4]?.code,
        color,
        param: "Height",
        quantity: quantity,
        length: P52 - 63,
      },

      {
        name: profiles[9]?.name,
        code: profiles[9]?.code,
        color,
        param: "Width",
        quantity: quantity * 4,
        length: P50,
      },

      {
        name: profiles[9]?.name,
        code: profiles[9]?.code,
        color,
        param: "Width",
        quantity: quantity * 2,
        length: P51,
      },
      {
        name: profiles[9]?.name,
        code: profiles[9]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: H51 + 140,
      },
      {
        name: profiles[9]?.name,
        code: profiles[9]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: P52 - 140 - H51,
      },
      {
        name: profiles[9]?.name,
        code: profiles[9]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: P52,
      },

      {
        name: profiles[11]?.name,
        code: profiles[11]?.code,
        color,
        param: "Width",
        quantity: quantity * blade,
        length: P50 - 145,
      },
      {
        name: profiles[11]?.name,
        code: profiles[11]?.code,
        color,
        param: "Width",
        quantity: quantity * Math.ceil((H51 + 100) / 120),
        length: P51 - 145,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: quantity * 4,
        length: P50 - 140,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: quantity * 4,
        length: P51 - 140,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 4,
        length: P52 - 280 - H51,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: H51,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: H51 + 100,
      },

      {
        name: profiles[13]?.name,
        code: profiles[13]?.code,
        color: "AS",
        param: "Width",
        quantity: quantity,
        length: jointCoverOffset ? width - 50 : width - 68,
      },

      {
        name: profiles[14]?.name,
        code: profiles[14]?.code,
        color: color,
        param: "Height",
        quantity:
          (Math.floor((P50 - 180) / 140) + Math.floor((P51 - 180) / 140)) *
          quantity,
        length: H51 + 20,
      },

      {
        name: profiles[15]?.name,
        code: profiles[15]?.code,
        color: "AS",
        param: "Height",
        quantity: 2 * quantity,
        length: 400,
      },
      {
        name: profiles[17]?.name,
        code: profiles[17]?.code,
        color: "AS",
        param: "Width",
        quantity: quantity,
        length: P50 - 59,
      },
      {
        name: profiles[17]?.name,
        code: profiles[17]?.code,
        color: "AS",
        param: "Width",
        quantity: quantity,
        length: P51 - 59,
      },
    ],
    accessories: [
      {
        name: accessories[0]?.name,
        code: accessories[0]?.code,
        color,
        quantity:
          ((lang === "EN" && closing === "Cremone" ? 1 : 0) +
            (lang === "EN" ? 1 : 0)) *
          quantity,
      },
      {
        name: accessories[1]?.name,
        code: accessories[1]?.code,
        color,
        quantity:
          ((lang === "FR" && closing === "Cremone" ? 1 : 0) +
            (lang === "FR" ? 1 : 0)) *
          quantity,
      },
      {
        name: accessories[2]?.name,
        code: accessories[2]?.code,
        color,
        quantity: (closing === "3 pts" ? 1 : 0) * quantity,
      },
      {
        name: accessories[3]?.name,
        code: accessories[3]?.code,
        color,
        quantity: (closing === "1 pts" ? 1 : 0) * quantity,
      },
      {
        name: accessories[4]?.name,
        code: accessories[4]?.code,
        color: "",
        quantity: quantity * 2,
      },
      {
        name: accessories[5]?.name,
        code: accessories[5]?.code,
        color: "",
        quantity: quantity,
      },
      {
        name: accessories[6]?.name,
        code: accessories[6]?.code,
        color: "",
        quantity:
          (Math.floor((P50 - 180) / 140) + Math.floor((P51 - 180) / 140)) *
          quantity,
      },
      {
        name: accessories[7]?.name,
        code: accessories[7]?.code,
        color: "",
        quantity:
          (Math.floor((P50 - 180) / 140) + Math.floor((P51 - 180) / 140)) *
          quantity *
          2,
      },

      {
        name: accessories[8]?.name,
        code: accessories[8]?.code,
        color: "",
        quantity: 8 * quantity,
      },
      {
        name: accessories[9]?.name,
        code: accessories[9]?.code,
        color: "",
        quantity: 12 * quantity,
      },

      {
        name: accessories[13]?.name,
        code: accessories[13]?.code,
        color,
        quantity: 2 * quantity,
      },
      {
        name: accessories[14]?.name,
        code: accessories[14]?.code,
        color,
        quantity: 8 * quantity,
      },
      {
        name: accessories[15]?.name,
        code: accessories[15]?.code,
        color: "",
        quantity: 2 * quantity,
      },
      {
        name: accessories[16]?.name,
        code: accessories[16]?.code,
        color: "",
        quantity: ((thresholdOffset ? 2 : 4) + 12) * quantity,
      },
      {
        name: accessories[17]?.name,
        code: accessories[17]?.code,
        color: "",
        quantity: 4 * quantity,
      },
      {
        name: accessories[18]?.name,
        code: accessories[18]?.code,
        color: "",
        quantity: Math.round(S41 + S50),
      },
      {
        name: accessories[19]?.name,
        code: accessories[19]?.code,
        color: "",
        quantity: Math.round(S56),
      },
      {
        name: accessories[20]?.name,
        code: accessories[20]?.code,
        color: "",
        quantity: Math.round([1, 4, 7, 11].includes(glazzingVal) ? S56 : 0),
      },
      {
        name: accessories[21]?.name,
        code: accessories[21]?.code,
        color: "",
        quantity: Math.round([5, 6, 9].includes(glazzingVal) ? S56 : 0),
      },
    ],
    glazzingValues: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P51 - 145,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 145 - 140 - H51,
      },
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P50 - 145,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 145 - 140 - H51,
      },
    ],
  };
};

function getGlazzingVal(glazzing) {
  if (glazzing === "6 mm Claire") {
    return 1;
  } else if (glazzing === "Double Vitrage Claire") {
    return 2;
  } else if (glazzing === "Double Vitrage Petit Bois") {
    return 3;
  } else if (glazzing === "33,1 Claire") {
    return 4;
  } else if (glazzing === "8 mm Claire") {
    return 5;
  } else if (glazzing === "44,2 Claire") {
    return 6;
  } else if (glazzing === "6 mm Imprimée") {
    return 7;
  } else if (glazzing === "33,1 Opale") {
    return 11;
  } else if (glazzing === "Lame Pleine") {
    return 9;
  } else {
    return 10;
  }
}
