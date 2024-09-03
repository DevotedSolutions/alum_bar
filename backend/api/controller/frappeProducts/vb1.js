const dataset = require("../frappeDataset.json");

exports.getVB1Data = ({
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
  let O32 = jointCoverOffset ? width - 30 : width - 48;
  const P50 = 0;
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
  const H51 = basementOffset ? blade * 120 : 0;
  const P59 = P52 - (basementOffset ? 180 + H51 : 140);
  const P56 = Math.ceil((P52 - 126) / 120);
  const O46 = basementOffset ? quantity : 0;
  const R41 =
    ((thresholdOffset ? quantity : quantity * 2) *
      (jointCoverOffset ? width + 36 : width)) /
    1000;
  const R42 =
    (quantity * 2 * (!thresholdOffset && jointCoverOffset ? P38 + 18 : P38)) /
    1000;
  const S41 = (R41 + R42) * 1.07;
  const R51 = (quantity * 2 * P50) / 1000;
  const R52 = (quantity * 2 * P51) / 1000;
  const R53 = (quantity * 2 * P52) / 1000;
  const S50 = (R51 + R52 + R53) * 1.07;

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
        name: profiles[4]?.name,
        code: profiles[4]?.code,
        color,
        param: "Height",
        quantity: basementOffset ? quantity : 0,
        length: P51 - 140,
      },

      {
        name: profiles[16]?.name,
        code: profiles[16]?.code,
        color,
        param: "Width",
        quantity: quantity * 2,
        length: P51,
      },
      {
        name: profiles[16]?.name,
        code: profiles[16]?.code,
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
        quantity: glazzingVal === 9 ? quantity * P56 : 0,
        length: P51 - 126,
      },
      {
        name: profiles[11]?.name,
        code: profiles[11]?.code,
        color,
        param: "Width",
        quantity: glazzingVal === 9 ? quantity * P56 : 0,
        length: P51 - 126,
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
        name: profiles[15]?.name,
        code: profiles[15]?.code,
        color: "AS",
        param: "Height",
        quantity: (thirdPartyValue === 775 ? 2 : 1) * quantity,
        length: thirdPartyValue === 775 ? 400 : height - 400,
      },
    ],
    accessories: [
      {
        name: accessories[0]?.name,
        code: accessories[0]?.code,
        color,
        quantity: (langIsEN && closing === "Cremone" ? 1 : 0) * quantity,
      },
      {
        name: accessories[5]?.name,
        code: accessories[5]?.code,
        color: "",
        quantity: quantity,
      },

      {
        name: accessories[8]?.name,
        code: accessories[8]?.code,
        color: "",
        quantity: 2 * quantity,
      },
      {
        name: accessories[11]?.name,
        code: accessories[11]?.code,
        color: "",
        quantity: 4 * quantity,
      },

      {
        name: accessories[14]?.name,
        code: accessories[14]?.code,
        color,
        quantity: 4 * quantity,
      },
      {
        name: accessories[16]?.name,
        code: accessories[16]?.code,
        color: "",
        quantity: ((thresholdOffset ? 2 : 4) + 4) * quantity,
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
        color: "",
        quantity: Math.round(S41 + S50),
      },
      {
        name: accessories[20]?.name,
        code: accessories[20]?.code,
        color: "",
        quantity: Math.round(S50),
      },
    ],
    glazzingValues: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P51 - 126,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 126,
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
