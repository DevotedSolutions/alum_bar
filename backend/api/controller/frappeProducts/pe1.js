const dataset = require("../frappeDataset.json");

exports.getPE1Data = ({
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
  const largerWidth = width > 1400;

  const P38 = jointCoverOffset ? height + 18 : height;

  const P51 = jointCoverOffset ? width - 30 : width - 48;
  let P46 = largerWidth ? 190 : P51 - 140;

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

  const R41 =
    ((thresholdOffset ? quantity : quantity * 2) *
      (jointCoverOffset ? width + 36 : width)) /
    1000;
  const R42 =
    (quantity * 2 * (!thresholdOffset && jointCoverOffset ? P38 + 18 : P38)) /
    1000;
  const S41 = (R41 + R42) * 1.07;

  const R51 = (quantity * 2 * P51) / 1000;
  const R52 = (quantity * 2 * P52) / 1000;
  const S50 = (R51 + R52) * 1.07;

  const R56 =
    ((basementOffset ? quantity * 4 : quantity * 2) *
      (P51 - (largerWidth ? 370 : 140))) /
    1000;

  const R58 = (quantity * 2 * P59) / 1000;

  const S56 = (R56 + R58) * 1.07;

  const glazzingVal = getGlazzingVal(glazzing);

  const data = {
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
        param: "Height",
        quantity: largerWidth ? quantity : 0,
        length: largerWidth ? P52 - 140 : 0,
      },
      {
        name: profiles[3]?.name,
        code: profiles[3]?.code,
        color,
        param: "Width",
        quantity: basementOffset ? quantity : 0,
        length: P51 - 140,
      },

      {
        name: profiles[langIsEN ? 9 : 8]?.name,
        code: profiles[langIsEN ? 9 : 8]?.code,
        color,
        param: "Width",
        quantity: quantity * 2,
        length: P51,
      },
      {
        name: profiles[langIsEN ? 9 : 8]?.name,
        code: profiles[langIsEN ? 9 : 8]?.code,
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
        quantity: basementOffset ? quantity * blade : 0,
        length: P51 - 145,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: basementOffset ? quantity * 4 : quantity * 2,
        length: P51 - 140,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: P59,
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
        quantity: quantity * 2,
        length: 400,
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
        name: accessories[2]?.name,
        code: accessories[2]?.code,
        color,
        quantity: (closing === "3 pts" ? 1 : 0) * quantity,
      },

      {
        name: accessories[8]?.name,
        code: accessories[8]?.code,
        color: "",
        quantity: 2 * quantity,
      },
      {
        name: accessories[9]?.name,
        code: accessories[9]?.code,
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
        name: accessories[19]?.name,
        code: accessories[19]?.code,
        color: "",
        quantity: Math.round(S56),
      },

      {
        name: accessories[21]?.name,
        code: accessories[21]?.code,
        color: "",
        quantity: Math.round(S56),
      },
    ],
    glazzingValues: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P51 - 145,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P59 - 5,
      },
    ],
  };
  return {
    ...data,
    profiles: data?.profiles?.filter(
      (profile) => profile.quantity > 0 || profile.length > 0
    ),
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
