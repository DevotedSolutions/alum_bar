import axios from "../BaseUrl";

/** Pull a filename out of `Content-Disposition`, falling back to a dated one. */
const fileNameFrom = (disposition) => {
  const match = /filename="?([^"]+)"?/.exec(disposition || "");
  return match
    ? match[1]
    : `reorder-critical-stock-${new Date().toISOString().slice(0, 10)}.xlsx`;
};

/**
 * Download the reorder/critical-stock panel as a spreadsheet. The workbook is
 * built server-side (exceljs), so the file carries the same columns, banding
 * and totals the dashboard shows rather than a bare CSV dump.
 */
export const exportStockSummary = async () => {
  const response = await axios.get("/dashboard/stock-summary.xlsx", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileNameFrom(response.headers?.["content-disposition"]);
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => window.URL.revokeObjectURL(url), 2000);
};
