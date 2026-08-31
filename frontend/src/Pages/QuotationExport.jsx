import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import { getAllQuotations } from "../services/designation/getAllDesignation";
import { deleteQuotation } from "../services/designation/deleteDesignation";
import { COLORS, buttonSx } from "../theme/tokens";

const QuotationExport = () => {
  const [quotations, setquotations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [update, setUpdate] = useState(false);

  const handleDownloadSelected = () => {
    selectedRows.forEach((rowId) => {
      const sheet = quotations.find((q) => q._id === rowId);
      if (sheet) {
        const link = document.createElement("a");
        link.href = `https://app.noutfermeture.com/api/${sheet?.filePath}`;
        link.target = "_blank";
        link.download = sheet?.filePath.split("/").pop();
        link.click();
      }
    });
  };

  const handleDeleteSelected = () => {
    selectedRows.forEach(async (rowId) => {
      const sheet = quotations.find((q) => q._id === rowId);
      if (sheet) {
        await deleteQuotation(sheet?._id);
        setUpdate(!update);
      }
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    getData();
  }, [update]);

  async function getData() {
    try {
      const resp = await getAllQuotations();
      if (resp.status === 200) {
        setquotations(resp.data);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }

  const filtered = quotations?.filter(
    (item) =>
      item?.clientName?.toUpperCase()?.includes(searchQuery?.toUpperCase()) ||
      item?.email?.toUpperCase()?.includes(searchQuery?.toUpperCase()) ||
      item?.phone?.toUpperCase()?.includes(searchQuery?.toUpperCase()) ||
      item?.devisNumber?.toUpperCase()?.includes(searchQuery?.toUpperCase())
  ) || [];

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((s) => selectedRows.includes(s._id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedRows((prev) => prev.filter((id) => !filtered.some((s) => s._id === id)));
    } else {
      setSelectedRows((prev) => [
        ...prev,
        ...filtered.filter((s) => !prev.includes(s._id)).map((s) => s._id),
      ]);
    }
  };

  const checkboxSx = (checked) => ({
    width: 22,
    height: 22,
    margin: "0 auto",
    border: `1.5px solid ${checked ? COLORS.headerTeal : "#BFC5CB"}`,
    background: checked ? COLORS.headerTeal : "#fff",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  });

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "16px" }}>
        <input
          placeholder="Search quotations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ height: "46px", boxSizing: "border-box", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", padding: "0 16px", fontSize: "14.5px", width: "340px", color: COLORS.textPrimary, outline: "none", background: "#fff" }}
        />
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={handleDownloadSelected}
          disabled={selectedRows.length === 0}
          sx={{ ...buttonSx.outline("46px"), display: "flex", alignItems: "center", gap: "10px", opacity: selectedRows.length === 0 ? 0.5 : 1 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5" /><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" /><path d="M9 14l3 3 3-3" /></svg>
          Download selected
        </Button>
        <Button
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
          sx={{ ...buttonSx.danger("46px"), opacity: selectedRows.length === 0 ? 0.5 : 1 }}
        >
          Delete selected
        </Button>
        <Box sx={{ fontSize: "14.5px", fontWeight: 600, color: "#3A4150" }}>
          {selectedRows.length} selected
        </Box>
      </Box>

      <Box sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", overflowX: "auto", boxShadow: "0 1px 3px rgba(20,26,32,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }}>
              {["Client name", "Quotation number", "Phone", "Email", "Created at", "Quotation"].map((h) => (
                <th key={h} style={{ padding: "16px 18px", color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)" }}>
                  {h}
                </th>
              ))}
              <th style={{ padding: "16px 18px", color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)", width: 95 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  Select
                  <Box onClick={toggleSelectAll} sx={checkboxSx(allVisibleSelected)}>
                    {allVisibleSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 9 17 20 6" /></svg>
                    )}
                  </Box>
                </Box>
              </th>
              <th style={{ padding: "16px 18px", color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", textAlign: "center", width: 95 }}>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
                  No quotation matches this search.
                </td>
              </tr>
            ) : (
              filtered.map((sheet) => {
                const checked = selectedRows.includes(sheet._id);
                return (
                  <tr key={sheet._id}>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", color: COLORS.textPrimary }}>
                      {sheet.clientName}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <span style={{ display: "inline-block", background: COLORS.neutralChipBg, color: COLORS.neutralChipFg, fontSize: "13px", padding: "6px 12px", borderRadius: "5px" }}>
                        {sheet.devisNumber}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", color: COLORS.textSecondary }}>
                      {sheet.phone}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", color: COLORS.textSecondary }}>
                      {sheet.email}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", color: COLORS.textSecondary, textAlign: "center" }}>
                      {moment(sheet.uploadedAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <Box
                        component="a"
                        href={`https://app.noutfermeture.com/api/${sheet?.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ ...buttonSx.outline("36px"), display: "inline-flex", alignItems: "center", gap: "9px", textDecoration: "none" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><polyline points="7 11 12 16 17 11" /><path d="M4 20h16" /></svg>
                        Download
                      </Box>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <Box onClick={() => handleCheckboxChange(sheet._id)} sx={checkboxSx(checked)}>
                        {checked && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 9 17 20 6" /></svg>
                        )}
                      </Box>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <Box
                        component="button"
                        onClick={async () => {
                          const response = await deleteQuotation(sheet?._id);
                          toast?.success(response?.data?.message);
                          setUpdate(!update);
                        }}
                        sx={{ width: 38, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "1px solid #F0B4B9", color: "#D22D3A", borderRadius: "6px", cursor: "pointer", "&:hover": { background: "#FDF0F1" } }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      </Box>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default QuotationExport;
