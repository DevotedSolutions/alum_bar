import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  addNewJobSheet,
  deleteJobSheet,
  getAllJobSheets,
} from "../services/jobSheets/getAllJobSheets";
import { toast } from "react-toastify";
import moment from "moment";
import JobSheetPopup from "../Components/jobSheets/createJobSheet";
import { COLORS, buttonSx, tagStyle } from "../theme/tokens";
import { AddIcon } from "../Components/common/navIcons";
import ConfirmDialog from "../Components/common/ConfirmDialog";

const statusInfo = (sheet) => {
  if (sheet.completed) return { label: "Completed", tone: "ok" };
  if (sheet.numberOfSheets > 0) return { label: "In progress", tone: "info" };
  return { label: "Open", tone: "warn" };
};

const JobSheetPage = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [update, setUpdate] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [update]);

  async function getData() {
    try {
      const resp = await getAllJobSheets();
      if (resp.status === 200) {
        setJobSheets(resp.data);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }

  const handleClosePopup = () => setIsPopupOpen(false);

  const handleCreateJobSheet = async (type) => {
    try {
      const resp = await addNewJobSheet({ type });
      if (resp.status === 200) {
        setUpdate(!update);
        toast.success("Job Sheet Added");
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  };

  const confirmDeleteSheet = async () => {
    if (deleteTarget) {
      const resp = await deleteJobSheet(deleteTarget._id);
      if (resp.status === 200) {
        setUpdate(!update);
        toast.success("Job sheet deleted successfully!");
      } else {
        toast.error("Could not delete the job sheet");
      }
    }
    setDeleteTarget(null);
  };

  return (
    <Box>
      <Box sx={{ marginBottom: "16px" }}>
        <Button
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          sx={{ ...buttonSx.primary("46px"), display: "flex", alignItems: "center", gap: "10px", letterSpacing: "0.04em" }}
        >
          <AddIcon size={17} />
          NEW JOB SHEET
        </Button>

        <JobSheetPopup open={isPopupOpen} onClose={handleClosePopup} onCreate={handleCreateJobSheet} />
      </Box>

      <Box sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", overflowX: "auto", boxShadow: "0 1px 3px rgba(20,26,32,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }}>
              {["Status", "Type", "Created date", "Sheets inside", "Details", "Actions"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: "16px 18px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    borderRight: i < 5 ? "1px solid rgba(255,255,255,0.12)" : "none",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobSheets.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
                  No job sheets yet.
                </td>
              </tr>
            ) : (
              jobSheets.map((sheet) => {
                const status = statusInfo(sheet);
                return (
                  <tr key={sheet.id}>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <span style={tagStyle(status.tone)}>{status.label}</span>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", fontWeight: 600, color: COLORS.textPrimary, textAlign: "center" }}>
                      {sheet.type}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                      {moment(sheet.createdAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                      {sheet.numberOfSheets}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <Button sx={buttonSx.outline("34px")} onClick={() => navigate(`${sheet._id}`)}>
                        Details
                      </Button>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <Box
                        component="button"
                        onClick={() => setDeleteTarget(sheet)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete job sheet"
        message={deleteTarget ? `This job sheet (${deleteTarget.type}) and its contents will be permanently removed.` : ""}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={confirmDeleteSheet}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default JobSheetPage;
