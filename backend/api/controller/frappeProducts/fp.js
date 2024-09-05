const dataset = require("../frappeDataset.json");

exports.getFPData = ({
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

  const H49 = basementOffset ? blade * 120 : 0;
  const H51 = basementOffset ? (thresholdOffset ? H49 + 56 : H49 + 47) : 0;

  const P56 = thresholdOffset ? height - 42 : height - 60;

  const R51 =
    (quantity *
      (basementOffset ? 4 : 2) *
      (jointCoverOffset ? width - 42 : width - 60)) /
    1000;
  const R52 =
    (quantity * (basementOffset ? 2 : 0) * (basementOffset ? blade * 120 : 0)) /
    1000;
  const R53 = (quantity * 2 * (basementOffset ? P56 - H51 - 40 : P56)) / 1000;
  const S57 = (R51 + R52 + R53) * 1.07;

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
        quantity: basementOffset ? quantity : 0,
        length: jointCoverOffset ? width - 42 : width - 60,
      },
      {
        name: profiles[11]?.name,
        code: profiles[11]?.code,
        color,
        param: "Width",
        quantity: basementOffset ? quantity * blade + 1 : 0,
        length: jointCoverOffset ? width - 47 : width - 65,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: basementOffset ? quantity * 4 : quantity * 2,
        length: jointCoverOffset ? width - 42 : width - 60,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: basementOffset ? quantity * 2 : 0,
        length: basementOffset ? blade * 120 : 0,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: basementOffset ? P56 - H51 - 40 : P56,
      },
    ],
    accessories: [
      {
        name: accessories[8]?.name,
        code: accessories[8]?.code,
        color: "",
        quantity: (basementOffset ? 4 : 2) * quantity,
      },
      {
        name: accessories[15]?.name,
        code: accessories[15]?.code,
        color: "",
        quantity: (basementOffset ? 2 : 0) * quantity,
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
    glazzingValues: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal)
          ? 0
          : thresholdOffset
          ? width - 47
          : width - 65,
        height: [9, 10]?.includes(glazzingVal)
          ? 0
          : basementOffset
          ? P56 - H51 - 45
          : P56 - 5,
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
