const dataset = require("../frappeDataset.json");

exports.getPCV2Data = ({
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

  const isSmallSize = width < 1301;
  const isMediumSize = width > 1300 && width < 1551;
  const isLargeSize = width > 1550;

  const jointCoverOffset = jointCovers === "yes";
  const thresholdOffset = threshold === "yes";
  const basementOffset = basement === "yes";
  const langIsEN = lang === "EN";
  const largerWidth = width > 1400;

  const P38 = jointCoverOffset ? height + 18 : height;

  let O32 = jointCoverOffset ? width - 36 : width - 54;

  let P40 = isSmallSize
    ? Math.round((O32 - 520) / 4)
    : isMediumSize
    ? Math.round((O32 - 600) / 5)
    : Math.round((O32 - 680) / 6);
  const P50 = isLargeSize
    ? P40 * 3 + 340
    : isMediumSize
    ? P40 * 2 + 260
    : P40 + 180;
  const P51 = O32 - P50;
  const P45 = isSmallSize
    ? P50 - 140
    : isMediumSize
    ? Math.round((P50 - 180) / 2)
    : Math.round((P50 - 220) / 3);

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

  const O46 = basementOffset ? quantity : 0;
  const O46L = quantity + quantity * 3;
  const R41 =
    ((thresholdOffset ? quantity : quantity * 2) *
      (jointCoverOffset ? width + 36 : width)) /
    1000;
  const R42 =
    (quantity * 2 * (!thresholdOffset && jointCoverOffset ? P38 + 18 : P38)) /
    1000;
  const S41 = (R41 + R42) * 1.07;
  const R50 = (quantity * 2 * P50) / 1000;
  const R51 = (quantity * 2 * P51) / 1000;
  const R52 = (quantity * 4 * P52) / 1000;
  const S50 = (R50 + R51 + R52) * 1.07;

  const R56 =
    (quantity * (isSmallSize ? 20 : isMediumSize ? 26 : 28) * P45) / 1000;
  const R59 = (quantity * (isSmallSize ? 4 : 8) * 240) / 1000;
  const R57 = (quantity * 8 * 600) / 1000;
  const R58 = (quantity * 4 * (P52 - 1420)) / 1000;

  const R60 = (quantity * (isSmallSize ? 2 : 4) * (P52 - 700)) / 1000;
  const R61 = (quantity * (isLargeSize ? 4 : 2) * (P52 - 140)) / 1000;

  const S56 = (R56 + R57 + R58 + R59 + R60 + R61) * 1.07;

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
        param: "Width",
        quantity: quantity * (isSmallSize ? 6 : 8),
        length: P45,
      },
      {
        name: profiles[3]?.name,
        code: profiles[3]?.code,
        color,
        param: "Height",
        quantity: quantity * (isLargeSize ? 4 : isMediumSize ? 3 : 2),
        length: P52 - 140,
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
        name: profiles[langIsEN ? 9 : 8]?.name,
        code: profiles[langIsEN ? 9 : 8]?.code,
        color,
        param: "Width",
        quantity: quantity * 2,
        length: P50,
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
        quantity: quantity * 4,
        length: P52,
      },
      {
        name: profiles[11]?.name,
        code: profiles[11]?.code,
        color,
        param: "Width",
        quantity: quantity * (isLargeSize ? 28 : isMediumSize ? 28 : 24),
        length: P45 - 5,
      },

      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: (isLargeSize ? 28 : isMediumSize ? 26 : 20) * quantity,
        length: P45,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * (isSmallSize ? 4 : 8),
        length: 240,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 8,
        length: 600,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 4,
        length: P52 - 1420,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * (isSmallSize ? 2 : 4),
        length: P52 - 700,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * (isLargeSize ? 4 : 2),
        length: P52 - 140,
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
        name: accessories[3]?.name,
        code: accessories[3]?.code,
        color,
        quantity: (closing === "1 pt" ? 1 : 0) * quantity,
      },
      {
        name: accessories[4]?.name,
        code: accessories[4]?.code,
        color: "",
        quantity: quantity,
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
        quantity: (isSmallSize ? 20 : isMediumSize ? 26 : 28) * quantity,
      },
      {
        name: accessories[9]?.name,
        code: accessories[9]?.code,
        color: "",
        quantity: 8 * quantity,
      },
      {
        name: accessories[13]?.name,
        code: accessories[13]?.code,
        color: "",
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
        color,
        quantity: (isSmallSize ? 8 : isMediumSize ? 11 : 12) * quantity * 2,
      },
      {
        name: accessories[16]?.name,
        code: accessories[16]?.code,
        color: "",
        quantity: ((thresholdOffset ? 2 : 4) + 8) * quantity,
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
        quantity: Math.round(S56),
      },
    ],
    glazzingValues: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P45 - 5,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 1425,
      },
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P45 - 5,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 705,
      },
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P45 - 5,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 145,
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
