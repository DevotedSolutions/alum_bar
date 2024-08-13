const PDFDocument = require("pdfkit");
const fs = require("fs");
const { promisify } = require("util");
const { optimizeJobSheet } = require("./optimize");

exports.exportToPDF = async (
  jobSheetId,
  frappeJSObjects,
  glazzingSum,
  accSum,
  profilesSum
) => {
  try {
    const doc = new PDFDocument();

    // Function to add a page for each FrappeJS object
    const addSheetToPDF = (frappeJS, index) => {
      if (index > 0) {
        doc.addPage();
      }

      doc.fontSize(16).text(`Sheet ${index + 1} - ${frappeJS.windowRef}`, {
        align: "center",
      });
      doc.moveDown();

      // Add string data
      const stringData = [
        ["Title", frappeJS.title],
        ["Created At", frappeJS.createdAt],
        ["Client", frappeJS.client],
        ["Project", frappeJS.projet],
        ["Repere", frappeJS.repere],
        ["Handle Direction", frappeJS.handleDirection],
        ["Handle Height", frappeJS.handleHeight],
        ["Joint Covers", frappeJS.jointCovers],
        ["Threshold", frappeJS.threshold],
        ["Closing", frappeJS.closing],
        ["Third Party", frappeJS.thirdParty],
        ["Third Party Value", frappeJS.thirdPartyValue],
      ];

      stringData.forEach(([label, value]) => {
        doc.fontSize(12).text(`${label}: ${value}`, { align: "left" });
      });

      doc.moveDown();

      const stringData2 = [
        ["Window Ref", frappeJS.windowRef],
        ["Quantity", frappeJS.quantity],
        ["Width", frappeJS.width],
        ["Height", frappeJS.height],
        ["Glazzing", frappeJS.glazzing],
      ];

      stringData2.forEach(([label, value]) => {
        doc.fontSize(12).text(`${label}: ${value}`, { align: "left" });
      });

      doc.moveDown();

      // Add tables
      const addTable = (data, title) => {
        doc.fontSize(14).text(title, { align: "center" });
        doc.moveDown();

        const headers = Object.keys(data[0].toObject()).filter(
          (key) => key !== "_id"
        );
        doc.fontSize(12).text(headers.join(" | "), { align: "left" });

        data.forEach((row) => {
          const rowData = headers.map((header) => row[header]);
          doc.fontSize(12).text(rowData.join(" | "), { align: "left" });
        });

        doc.moveDown();
      };

      if (frappeJS.profiles && frappeJS.profiles.length > 0) {
        addTable(frappeJS.profiles, "Profiles");
      }

      if (frappeJS.accessories && frappeJS.accessories.length > 0) {
        addTable(frappeJS.accessories, "Accessories");
      }

      if (frappeJS.glazzingValues && frappeJS.glazzingValues.length > 0) {
        addTable(frappeJS.glazzingValues, "Glazzing Values");
      }
    };

    // Add each sheet as a new page
    frappeJSObjects.forEach(addSheetToPDF);

    // Add summary pages
    const addSummaryPage = (title, data) => {
      doc.addPage();
      doc.fontSize(16).text(title, { align: "center" });
      doc.moveDown();

      data.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          doc.fontSize(12).text(`${key}: ${value}`, { align: "left" });
        });
        doc.moveDown();
      });
    };

    addSummaryPage("Summary - Glazzing", glazzingSum);
    addSummaryPage("Summary - Accessories", accSum);
    addSummaryPage("Summary - Profiles", profilesSum);

    const uniqueCodes = [...new Set(profilesSum.map((item) => item.code))];

    uniqueCodes.forEach((code) => {
      const filteredData = profilesSum.filter(
        (profile) => profile.code === code
      );
      const optimizedSheet = optimizeJobSheet([...filteredData]);

      doc.addPage();
      doc.fontSize(16).text(`Profile Code: ${code}`, { align: "center" });
      doc.moveDown();

      // Add profile data
      filteredData.forEach((data) => {
        doc
          .fontSize(12)
          .text(`Quantity: ${data.quantity} | Length: ${data.length}`, {
            align: "left",
          });
      });

      doc.moveDown();

      // Add optimized sheet data
      optimizedSheet.forEach((data) => {
        const lengthArray = data.Bars.flatMap((bar) =>
          Array(bar.Quantity).fill(bar.Length)
        );
        doc
          .fontSize(12)
          .text(
            `Total: ${data.Total} | Wastage: ${
              data.Wastage
            } | Length Sum: ${lengthArray.reduce(
              (acc, length) => acc + length,
              0
            )}`
          );

        doc.fontSize(12).text(`Bar Lengths: ${lengthArray.join(", ")}`);
        doc.moveDown();
      });
    });

    // Stream to write to file
    const pdfFilePath = `${jobSheetId}.pdf`;
    doc.pipe(fs.createWriteStream(pdfFilePath));
    doc.end();

    // Wait until file is fully written
    await promisify(fs.access)(pdfFilePath);

    return {
      success: true,
      message: "PDF file created",
      filePath: pdfFilePath,
    };
    console.log("PDF file created successfully!");
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
    };
  }
};
