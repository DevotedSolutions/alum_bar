import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  GetSheetOptimization,
  createFrappeExcel,
  deleteSheet,
  getFrappeJobSheets,
  getSumFrappeJS,
} from "../services/jobSheets/getAllJobSheets";
import { toast } from "react-toastify";
import moment from "moment";
import { useParams } from "react-router-dom";
import GlazzingTable from "../Components/jobSheets/GlazzingTable";
import OptimizedSheetTable from "../Components/jobSheets/OptimizationTable";
import { COLORS, buttonSx } from "../theme/tokens";
import { AddIcon, ChevronLeftIcon } from "../Components/common/navIcons";
import ConfirmDialog from "../Components/common/ConfirmDialog";

const sectionTitleSx = {
  fontSize: "15px",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: COLORS.textPrimary,
  marginBottom: "12px",
};

const cardSx = {
  background: "#fff",
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: "8px",
  overflowX: "auto",
  boxShadow: "0 1px 3px rgba(20,26,32,0.05)",
};

const th = (label, i, arr) => (
  <th
    key={label}
    style={{
      padding: "16px 18px",
      color: "#fff",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      textAlign: "center",
      borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
    }}
  >
    {label}
  </th>
);

const td = (children, extra) => (
  <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center", ...extra }}>
    {children}
  </td>
);

const JobSheetList = () => {
  const [jobSheets, setJobSheets] = useState([]);
  const [update, setUpdate] = useState(false);
  const [sumData, setSumData] = useState({
    sumVT: [],
    sumAcc: [],
    sumProfiles: [],
  });
  const [optimizedData, setOptimizedData] = useState([]);
  const [excelExport, setExcelExport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    getData();
  }, [update]);

  async function getData() {
    try {
      const resp = await getFrappeJobSheets(id);
      if (resp.status === 200) {
        setJobSheets(resp.data);
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.error("Check network connection");
    }
  }
  useEffect(() => {
    if (sumData.sumProfiles) {
      getOptimizedSheets(sumData.sumProfiles).then((sheetData) => {
        setOptimizedData([...sheetData]);
      });
    }
  }, [sumData.sumProfiles]);

  async function getOptimizedSheets(data) {
    const groupedByCode = data.reduce((acc, item) => {
      if (!acc[item.code]) acc[item.code] = [];
      acc[item.code].push(item);
      return acc;
    }, {});

    const result = await Promise.all(
      Object.keys(groupedByCode).map(async (code) => ({
        code,
        optimizedSheet: await optimizeSheet(code, groupedByCode[code]),
      }))
    );

    return result;
  }

  async function optimizeSheet(code, data) {
    const codeData = data.filter((item) => item.code === code);
    try {
      const resp = await GetSheetOptimization([...codeData]);
      if (resp.status === 200) {
        return resp.data;
      } else {
        toast.error(resp.data.message);
        return null;
      }
    } catch (error) {
      toast.error("Check network connection");
      return null;
    }
  }

  const confirmDeleteSheet = async () => {
    if (deleteTarget) {
      const resp = await deleteSheet("frappe", deleteTarget._id);
      if (resp.status === 200) {
        setUpdate(!update);
        toast.success("Sheet deleted successfully!");
      } else {
        toast.error("Could not delete the sheet");
      }
    }
    setDeleteTarget(null);
  };

  const navigate = useNavigate();

  return (
    <Box>
      <Button
        onClick={() => navigate(-1)}
        sx={{ display: "flex", alignItems: "center", gap: "8px", textTransform: "none", color: COLORS.textSecondary, marginBottom: "12px" }}
      >
        <ChevronLeftIcon size={16} /> Back
      </Button>

      <Box sx={{ marginBottom: "16px" }}>
        <Button
          onClick={() => navigate(`newSheet`)}
          sx={{ ...buttonSx.primary("46px"), display: "flex", alignItems: "center", gap: "10px", letterSpacing: "0.04em" }}
        >
          <AddIcon size={17} />
          ADD NEW SHEET
        </Button>
      </Box>

      <Box sx={cardSx}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }}>
              {["Window ref.", "Title", "Date", "Client", "Quantity", "Width", "Height", "Details", "Actions"].map((h, i, arr) => th(h, i, arr))}
            </tr>
          </thead>
          <tbody>
            {jobSheets.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "48px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
                  No sheets in this job yet.
                </td>
              </tr>
            ) : (
              jobSheets.map((sheet) => (
                <tr key={sheet.id}>
                  {td(sheet.windowRef, { fontWeight: 600, color: COLORS.textPrimary })}
                  {td(sheet.title)}
                  {td(moment(sheet.createdAt).format("YYYY-MM-DD"))}
                  {td(sheet.client)}
                  {td(sheet.quantity)}
                  {td(sheet.width)}
                  {td(sheet.height)}
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
              ))
            )}
          </tbody>
        </table>
      </Box>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete sheet"
        message={deleteTarget ? `${deleteTarget.windowRef || deleteTarget.title} will be permanently removed from this job.` : ""}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={confirmDeleteSheet}
        onCancel={() => setDeleteTarget(null)}
      />

      <Button
        onClick={async () => {
          const resp = await getSumFrappeJS(id);
          if (resp.status === 200) {
            setSumData(resp.data);
            const resp1 = await createFrappeExcel(id);
            if (resp1.status) {
              setExcelExport(`https://app.noutfermeture.com/api/jobsheets/${id}.xlsx`);
            }
          } else {
            toast.error(resp.data.message);
          }
        }}
        sx={{ ...buttonSx.neutral("44px"), marginTop: "20px", marginBottom: "12px" }}
      >
        Optimize job sheet
      </Button>

      {sumData.sumVT.length > 0 && (
        <Box sx={{ margin: "20px 0" }}>
          <Box sx={sectionTitleSx}>Sum VT</Box>
          <GlazzingTable data={sumData.sumVT} />
        </Box>
      )}

      {sumData.sumAcc.length > 0 && (
        <Box sx={{ margin: "20px 0" }}>
          <Box sx={sectionTitleSx}>Sum Accessories</Box>
          <Box sx={cardSx}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.tableHeaderBg }}>
                  {["Name", "Code", "Color", "Quantity"].map((h, i, arr) => th(h, i, arr))}
                </tr>
              </thead>
              <tbody>
                {sumData.sumAcc.map((accessory) =>
                  accessory.list.map((item, idx) => (
                    <tr key={`${accessory.code}-${idx}`}>
                      {td(accessory.name, { color: COLORS.textPrimary, fontWeight: 600 })}
                      {td(accessory.code)}
                      {td(accessory.color)}
                      {td(item)}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Box>
        </Box>
      )}

      {sumData.sumProfiles?.length > 0 && (
        <Box sx={{ margin: "20px 0" }}>
          <Box sx={sectionTitleSx}>Sum Profiles</Box>
          <Box sx={cardSx}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.tableHeaderBg }}>
                  {["Name", "Code", "Color", "Type", "Quantity", "Value"].map((h, i, arr) => th(h, i, arr))}
                </tr>
              </thead>
              <tbody>
                {sumData.sumProfiles.map((profile, idx) => (
                  <tr key={`${profile.code}-${idx}`}>
                    {td(profile.name, { color: COLORS.textPrimary, fontWeight: 600 })}
                    {td(profile.code)}
                    {td(profile.color)}
                    {td(profile.param)}
                    {td(profile.quantity)}
                    {td(profile.length)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )}

      {optimizedData?.length > 0 && (
        <Box sx={{ margin: "20px 0" }}>
          <Box sx={sectionTitleSx}>Profiles Sheet Optimization</Box>
          <OptimizedSheetTable data={optimizedData} />
        </Box>
      )}

      {excelExport && (
        <Button
          component="a"
          href={excelExport}
          target="_blank"
          rel="noreferrer"
          sx={{ ...buttonSx.primary("44px"), textDecoration: "none" }}
        >
          Export as XLSX
        </Button>
      )}
    </Box>
  );
};

export default JobSheetList;
