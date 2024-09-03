const dataset = require("../frappeDataset.json");

exports.getF3Data = ({
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
  traverse63,
}) => {
  const profiles = dataset?.profiles || [];
  const accessories = dataset?.accessories || [];

  const jointCoverOffset = jointCovers === "yes";
  const thresholdOffset = threshold === "yes";
  const basementOffset = basement === "yes";
  const langIsEN = lang === "EN";

  const P38 = jointCoverOffset ? height + 18 : height;
  const P51 = Math.round(
    (width - (jointCoverOffset ? 42 : 60) - (traverse63 ? 46 : 80)) / 3
  );
  const P52 = height - (jointCoverOffset ? 42 : 60);
  const P66 = Math.round((P52 - 5) / 120);

  const R51 = (quantity * 6 * P51) / 1000;
  const R52 = (quantity * 6 * P52) / 1000;
  const S50 = (R51 + R52) * 1.07;

  const glazzingVal = getGlazzingVal(glazzing);

  return {
    profiles: [
      {
        name: profiles[jointCoverOffset ? 1 : 0]?.name,
        code: profiles[jointCoverOffset ? 1 : 0]?.code,
        color,
        param: "Width",
        quantity: quantity * 2,
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
        next: "45/45",
      },
      {
        name: profiles[3]?.name,
        code: profiles[3]?.code,
        color,
        param: "Height",
        quantity: quantity * 2,
        length: jointCoverOffset ? height - 42 : height - 60,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Width",
        quantity: quantity * 6,
        length: P51,
      },
      {
        name: profiles[10]?.name,
        code: profiles[10]?.code,
        color,
        param: "Height",
        quantity: quantity * 6,
        length: P52,
      },

      {
        name: profiles[11]?.name,
        code: profiles[11]?.code,
        color,
        param: "Width",
        quantity: glazzingVal === 9 ? quantity * 3 : 0,
        length: P51 - 5,
      },
    ],
    accessories: [
      {
        name: accessories[15]?.name,
        code: accessories[15]?.code,
        color: "",
        quantity: 4 * quantity,
      },
      {
        name: accessories[16]?.name,
        code: accessories[16]?.code,
        color: "",
        quantity: 4 * quantity,
      },
      {
        name: accessories[17]?.name,
        code: accessories[17]?.code,
        color: "",
        quantity: 3 * quantity,
      },
      {
        name: accessories[19]?.name,
        code: accessories[19]?.code,
        color: "",
        quantity: Math.round(S50),
      },
      {
        name: accessories[20]?.name,
        code: accessories[20]?.code,
        color: "",
        quantity: Math.round([1, 4, 7, 11].includes(glazzingVal) ? S50 : 0),
      },
    ],
    glazzingValues: [
      {
        code: glazzingVal,
        quantity: glazzingVal > 0 && glazzingVal <= 11 ? quantity * 3 : 0,
        width: [9, 10]?.includes(glazzingVal) ? 0 : P51 - 5,
        height: [9, 10]?.includes(glazzingVal) ? 0 : P52 - 5,
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
