const dataset = require("../frappeDataset.json");

exports.getSOU1Data = ({
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
}) => {
  const profiles = dataset?.profiles || [];
  const accessories = dataset?.accessories || [];

  const jointCoverOffset = jointCovers === "yes";
  const thresholdOffset = threshold === "yes";
  const basementOffset = basement === "yes";
  const langIsEN = lang === "EN";

  const P51 = width - (jointCoverOffset ? 30 : 48);
  const P52 = height - (jointCoverOffset ? 30 : 48);
  const R41 =
    ((thresholdOffset ? quantity : quantity * 2) *
      (jointCoverOffset ? width + 36 : width)) /
    1000;
  const R42 = (quantity * 2 * (jointCoverOffset ? height + 36 : height)) / 1000;
  const S41 = (R41 + R42) * 1.07;
  const R51 = (quantity * 2 * P51) / 1000;
  const R52 = (quantity * 2 * P52) / 1000;
  const S50 = (R51 + R52) * 1.07;
  const R56 = (quantity * (basementOffset ? 4 : 2) * (P51 - 82)) / 1000;
  const R57 = (quantity * 2 * (P52 - 82)) / 1000;

  const S57 = (R56 + R57) * 1.07;

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
        length: jointCoverOffset ? height + 36 : height,
        next: thresholdOffset ? "90/45 45/90" : "45/45",
      },
      {
        name: profiles[3]?.name,
        code: profiles[3]?.code,
        color,
        param: "Width",
        quantity: thresholdOffset ? quantity : 0,
        length: 0,
      },

      {
        name: profiles[4]?.name,
        code: profiles[4]?.code,
        color,
        param: "Height",
        quantity: 0,
        length: P52 - 63,
      },

      {
        name: profiles[langIsEN ? 6 : 5]?.name,
        code: profiles[langIsEN ? 6 : 5]?.code,
        color,
        param: "Width",
        quantity: quantity * 2,
        length: P51,
      },
      {
        name: profiles[langIsEN ? 6 : 5]?.name,
        code: profiles[langIsEN ? 6 : 5]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: P52,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: quantity * (basementOffset ? 4 : 2),
        length: P51 - 82,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: quantity * (basementOffset ? 2 : 0),
        length: 0,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: P52 - 82,
      },
    ],
    accessories: [
      {
        name: accessories[8]?.name,
        code: accessories[8]?.code,
        color: "",
        quantity: 2 * quantity,
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
        color: "",
        quantity: 2 * (basementOffset ? quantity : 0),
      },
      {
        name: accessories[16]?.name,
        code: accessories[16]?.code,
        color: "",
        quantity: (thresholdOffset ? 2 : 4) * quantity,
      },
      {
        name: accessories[17]?.name,
        code: accessories[17]?.code,
        color: "",
        quantity: 2 * quantity,
      },

      {
        name: accessories[18]?.name,
        code: accessories[18]?.code,
        color,
        quantity: Math.round(S41 + S50),
      },
      {
        name: accessories[19]?.name,
        code: accessories[19]?.code,
        color: "",
        quantity: Math.round(S57),
      },
      {
        name: accessories[20]?.name,
        code: accessories[20]?.code,
        color: "",
        quantity: Math.round([1, 4, 7, 11].includes(glazzingVal) ? S57 : 0),
      },
      {
        name: accessories[21]?.name,
        code: accessories[21]?.code,
        color: "",
        quantity: Math.round([5, 6, 9].includes(glazzingVal) ? S57 : 0),
      },
    ],
    glazzing: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P51 - 87,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 87,
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
