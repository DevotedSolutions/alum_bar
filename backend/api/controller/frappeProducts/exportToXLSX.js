const { optimizeJobSheet } = require("./optimize");

const ExcelJS = require("exceljs");

exports.exporttoXLSX = async (
  jobSheetId,
  frappeJSObjects,
  glazzingSum,
  accSum,
  profilesSum
) => {
  try {
    const workbook = new ExcelJS.Workbook();

    const formatSheet = (sheet) => {
      sheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          if (cellValue.length > maxLength) {
            maxLength = cellValue.length;
          }
        });
        column.width = maxLength + 5; // Adjust the width
      });
    };

    // Loop through each FrappeJS object and create a new sheet
    frappeJSObjects.forEach((frappeJS, index) => {
      const sheet = workbook.addWorksheet(
        index + 1 + " - " + frappeJS.windowRef
      );

      // Add string data to the top of the sheet with formatting
      const stringData = [
        ["Title", frappeJS.title],
        ["Created At", frappeJS.createdAt],
        ["Client", frappeJS.client],
        ["Projet", frappeJS.projet],
        ["Repere", frappeJS.repere],
        ["Handle Direction", frappeJS.handleDirection],
        ["Handle Height", frappeJS.handleHeight],
        ["Joint Covers", frappeJS.jointCovers],
        ["Threshold", frappeJS.threshold],
        ["Closing", frappeJS.closing],
        ["Third Party", frappeJS.thirdParty],
        ["Third Party Value", frappeJS.thirdPartyValue],
      ];

      stringData.forEach((data) => {
        const row = sheet.addRow(data);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 13,
            bold: true,
            color: { argb: "FF000000" },
          };
        });
      });
      sheet.addRow([]);
      sheet.addRow([]);
      const stringData2 = [
        ["Window Ref", frappeJS.windowRef],
        ["Quantity", frappeJS.quantity],
        ["Width", frappeJS.width],
        ["Height", frappeJS.height],
        ["Glazzing", frappeJS.glazzing],
      ];

      stringData2.forEach((data) => {
        const row = sheet.addRow(data);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 13,
            bold: true,
            color: { argb: "FF000000" },
          };
        });
      });

      // Add an empty row before the tables
      sheet.addRow([]);

      // Function to add a table to the sheet with formatting
      const addTable = (sheet, values, title) => {
        const titleRow = sheet.addRow([title]);
        titleRow.font = { bold: true, size: 13 };
        titleRow.alignment = { horizontal: "center" };
        sheet.addRow([]); // Add an empty row after the title

        // Get the headers, excluding '_id'
        const firstRow = values[0].toObject();
        const headers = Object.keys(firstRow).filter((key) => key !== "_id");
        const headerRow = sheet.addRow(headers);
        headerRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 13,
            bold: true,
            color: { argb: "FF000000" },
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });

        values.forEach((row) => {
          const plainRow = row.toObject();
          // Exclude '_id' and map the remaining keys to the row values
          const rowArr = headers.map((header) => plainRow[header]);

          const rowData = sheet.addRow(rowArr);

          rowData.eachCell((cell) => {
            cell.alignment = { wrapText: true };

            cell.font = {
              name: "Bookman Old Style",
              size: 13,
              bold: false,
              color: { argb: "FF000000" },
            };
            cell.alignment = { vertical: "middle", horizontal: "left" };
          });
        });

        sheet.addRow([]); // Add an empty row after the table
      };

      // Add tables for profiles, accessories, and glazzingValues
      if (frappeJS.profiles && frappeJS.profiles.length > 0) {
        addTable(sheet, frappeJS.profiles, "Profiles");
      }

      if (frappeJS.accessories && frappeJS.accessories.length > 0) {
        addTable(sheet, frappeJS.accessories, "Accessories");
      }
      if (frappeJS.glazzingValues && frappeJS.glazzingValues.length > 0) {
        addTable(sheet, frappeJS.glazzingValues, "Glazzing Values");
      }
      formatSheet(sheet);
    });
    const sheetVT = workbook.addWorksheet("SUM VIT");
    glazzingSum.forEach((glazzing) => {
      const glazzingData = [
        ["Quantity", glazzing.quantity],
        ["Width", glazzing.width],
        ["Height", glazzing.height],
        ["Glazzing", glazzing.glazzing],
        ["Glazzing Code", glazzing.glazzingValues[0].code],
      ];

      glazzingData.forEach((data) => {
        const row = sheetVT.addRow(data);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 13,
            color: { argb: "FF000000" },
          };
        });
      });

      glazzing.glazzingValues.forEach((data) => {
        const row = sheetVT.addRow([
          glazzing.repere,
          data.quantity,
          "unit/s",
          data.width,
          "X",
          data.height,
        ]);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 13,
            color: { argb: "FF000000" },
          };
        });
        sheetVT.addRow([]);
        sheetVT.addRow([]);
      });
      formatSheet(sheetVT);
    });

    const sheetAcc = workbook.addWorksheet("SUM Acc");
    accSum.forEach((acc) => {
      acc.list.forEach((data) => {
        const row = sheetAcc.addRow([acc.name, acc.code, acc.color, data]);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 13,
            color: { argb: "FF000000" },
          };
        });
      });
      sheetAcc.addRow([]);
    });

    formatSheet(sheetAcc);

    const sheetProfiles = workbook.addWorksheet("SUM Profiles");
    let last = profilesSum[0].code;
    profilesSum.forEach((profile) => {
      if (last !== profile.code) {
        sheetProfiles.addRow([]);
        last = profile.code;
      }

      const row = sheetProfiles.addRow([
        profile.name,
        profile.code,
        profile.color,
        profile.param,
        profile.quantity,
        profile.length,
      ]);
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = {
          name: "Bookman Old Style",
          size: 13,
          color: { argb: "FF000000" },
        };
      });
    });

    formatSheet(sheetProfiles);

    const uniqueCodes = [...new Set(profilesSum.map((item) => item.code))];

    uniqueCodes.forEach((code) => {
      const filteredData = profilesSum?.filter(
        (profile) => profile.code === code
      );
      const optimizedSheet = optimizeJobSheet([...filteredData]);
      const sheet = workbook.addWorksheet(code);
      filteredData.forEach((data) => {
        const row = sheet.addRow([data.quantity, data.length]);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 10,
            color: { argb: "FF000000" },
          };
        });
      });

      sheet.addRow([]);
      sheet.addRow([]);

      optimizedSheet.forEach((data) => {
        const lengthArray = data.Bars.flatMap((bar) =>
          Array(bar.Quantity).fill(bar.Length)
        );
        const row = sheet.addRow([
          data.Total,
          data.Wastage,
          lengthArray.reduce((acc, length) => acc + length, 0),
          ...lengthArray,
        ]);
        row.eachCell((cell, cellNumber) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Bookman Old Style",
            size: 10,
            color: { argb: "FF000000" },
          };
          if (cellNumber > 3) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ADD8E6" },
            };
          }
        });
      });
    });

    // Save the workbook to a file
    await workbook.xlsx.writeFile(jobSheetId + ".xlsx");

    return {
      message: "File created",
      success: true,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
