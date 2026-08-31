import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { getUsers } from "../services/User";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import {
  addEventByCountry,
  addLeave,
  deleteLeave,
  editLeave,
  getLeaves,
  getRemainingLeaves,
} from "../services/Events";
import moment from "moment";
import { COLORS, buttonSx, tagStyle, TONE } from "../theme/tokens";
import { AddIcon } from "../Components/common/navIcons";
import ConfirmDialog from "../Components/common/ConfirmDialog";

const statusTone = (status) =>
  status === "Approved" ? "ok" : status === "Pending" ? "warn" : "bad";

const leaveTypeLabel = (leaveType) =>
  leaveType === "localE"
    ? "Emergency Local Leave"
    : leaveType.charAt(0).toUpperCase() + leaveType.slice(1) + " Leave";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      username: window.localStorage.getItem("UserName"),
    },
  ]);
  const [leaves, setLeaves] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    userId: window.localStorage.getItem("UserId"),
    userName: window.localStorage.getItem("UserName"),
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });
  const [remainingLeaves, setRemainingLeaves] = useState([]);
  const [update, setUpdate] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All requests");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const isAdmin =
    window.localStorage.getItem("UserRole") === "admin" ||
    window.localStorage.getItem("UserRole")?.includes("admin");

  useEffect(() => {
    async function fetchUsers() {
      const result = await getUsers();
      if (result?.users) {
        setUsers(result?.users);
      } else {
        console.error("Error fetching users:");
      }
    }
    async function fetchLeaves() {
      const filters = isAdmin
        ? {}
        : {
            userId: window.localStorage.getItem("UserId"),
          };
      const result = await getLeaves(filters);
      toast?.info(result?.message);
      if (result?.leaves) {
        setLeaves(result?.leaves);
      } else {
        console.error("Error fetching leaves:");
      }
    }

    async function fetchRemainingLeaves() {
      const filters = {
        userId: window.localStorage.getItem("UserId"),
      };
      const result = await getRemainingLeaves(filters);

      if (result?.remainingLeaves) {
        setRemainingLeaves(result?.remainingLeaves);
      } else {
        console.error("Error fetching leaves:");
      }
    }

    if (isAdmin) {
      fetchUsers();
    }
    fetchLeaves();
    fetchRemainingLeaves();
  }, [update]);

  const handleOpenDialog = (leave = null) => {
    setIsEdit(Boolean(leave));
    setForm(leave);
    setForm(
      leave
        ? { ...leave }
        : {
            userName: window.localStorage.getItem("UserName"),
            userId: window.localStorage.getItem("UserId"),
            startDate: "",
            endDate: "",
            reason: "",
            leaveType: "",
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({
      userName: window.localStorage.getItem("UserName"),
      userId: window.localStorage.getItem("UserId"),
      startDate: "",
      endDate: "",
      reason: "",
      leaveType: "",
    });
  };

  const handleSaveLeave = async () => {
    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("Start date cannot be later than end date.");
      return;
    }

    if (!isEdit) {
      const result = await addLeave({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        userId: isAdmin
          ? users.find((user) => user.username === form?.userName)?._id
          : window.localStorage.getItem("UserId"),
      });
      if (result?.leave) {
        toast?.success(result?.message);
      } else {
        toast?.error(result?.message);
      }

      setUpdate(!update);
    }
    handleCloseDialog();
  };

  const handleLeaveStatus = async (leave) => {
    const response = await editLeave({
      ...leave,
    });
    if (response?.status === 200) {
      toast?.success(response?.data?.message);

      if (leave?.status === "Approved") {
        const addEvent = await addEventByCountry({
          title: `${leave?.userName}'s Leave`,
          description: leave?.reason || "",
          type: leave?.leaveType,
          start: leave.startDate,
          end: leave.endDate,
          country: window.localStorage.getItem("UserCountry"),
        });
        toast?.success(addEvent?.message);
      }
      setUpdate(!update);
      handleCloseDialog();
    }
  };

  const askDeleteLeave = (leave) => setDeleteTarget(leave);
  const cancelDeleteLeave = () => setDeleteTarget(null);
  const confirmDeleteLeave = async () => {
    if (deleteTarget) {
      await deleteLeave(deleteTarget._id);
      setUpdate(!update);
      toast?.success("Leave request deleted successfully.");
    }
    setDeleteTarget(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const filteredLeaves = leaves.filter(
    (l) => statusFilter === "All requests" || l.status === statusFilter
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "22px" }}>
        <Button
          onClick={() => handleOpenDialog()}
          sx={{ ...buttonSx.primary("48px"), display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", letterSpacing: "0.04em" }}
        >
          <AddIcon size={18} />
          APPLY LEAVE
        </Button>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ height: "48px", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", background: "#fff", fontSize: "14.5px", color: COLORS.textPrimary, padding: "0 16px", width: "200px", cursor: "pointer" }}
        >
          {["All requests", "Pending", "Approved", "Rejected"].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        {Object.entries(remainingLeaves).map(([leaveType, data]) => {
          const used = Number(data.used) || 0;
          const available = Number(data.available) || 0;
          const total = used + available;
          const pct = total ? Math.round((used / total) * 100) : 0;
          const accent = available <= 0 ? "#D22D3A" : COLORS.headerTeal;
          const label = leaveTypeLabel(leaveType);
          return (
            <Box key={leaveType} sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderTop: `3px solid ${accent}`, borderRadius: "8px", boxShadow: "0 1px 3px rgba(20,26,32,0.05)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "18px", padding: "20px 20px 12px" }}>
                <Box sx={{ width: 52, height: 52, minWidth: 52, border: `1.5px solid ${accent}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: accent, fontSize: 20, fontWeight: 700 }}>{label.charAt(0)}</span>
                </Box>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Box sx={{ fontSize: "16px", fontWeight: 700, color: COLORS.textPrimary }}>{label}</Box>
                  <Box sx={{ fontSize: "14px", color: COLORS.textSecondary, marginTop: "8px" }}>Used: {used}</Box>
                  <Box sx={{ fontSize: "14px", color: COLORS.textSecondary, marginTop: "4px" }}>Available:</Box>
                  <Box sx={{ fontSize: "34px", fontWeight: 800, color: accent, marginTop: "4px", lineHeight: 1.1 }}>{available}</Box>
                </Box>
              </Box>
              <Box sx={{ padding: "0 20px 8px" }}>
                <Box sx={{ height: "7px", borderRadius: "4px", background: "#E9ECEF", overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${pct}%`, background: accent, borderRadius: "4px" }} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 20px 16px", fontSize: "11.5px", color: COLORS.textFaint }}>
                <span>{pct}% used</span>
                <span>{100 - pct}% available</span>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ fontSize: "17px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textPrimary, marginBottom: "12px" }}>
        Leave requests
      </Box>

      <Box sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", overflowX: "auto", boxShadow: "0 1px 3px rgba(20,26,32,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }}>
              {["Username", "Start date", "End date", "Applied at", "Reason", "Leave type", "Status"]
                .concat(isAdmin ? ["Actions"] : [])
                .map((h, i, arr) => (
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
                      borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
                    }}
                  >
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} style={{ padding: "56px", textAlign: "center", color: COLORS.textFaint, fontSize: "14.5px" }}>
                  No leave requests yet
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => (
                <tr key={leave._id}>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textPrimary, textAlign: "center" }}>
                    {leave?.userName}
                  </td>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                    {new Date(leave?.startDate).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                    {new Date(leave?.endDate).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                    {new Date(leave?.appliedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                    {leave?.reason}
                  </td>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "13.5px", color: COLORS.textSecondary, textAlign: "center" }}>
                    {leave?.leaveType}
                  </td>
                  <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                    <span style={tagStyle(statusTone(leave?.status))}>{leave?.status}</span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: "13px 18px", borderBottom: `1px solid ${COLORS.rowBorder}` }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                        <Button
                          onClick={() => handleLeaveStatus({ ...leave, status: "Approved" })}
                          disabled={leave?.status !== "Pending"}
                          sx={{ ...buttonSx.outline("30px"), borderColor: TONE.ok.border, color: TONE.ok.fg, "&:hover": { background: TONE.ok.bg }, opacity: leave?.status !== "Pending" ? 0.5 : 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleLeaveStatus({ ...leave, status: "Rejected" })}
                          disabled={leave?.status !== "Pending"}
                          sx={{ ...buttonSx.danger("30px"), opacity: leave?.status !== "Pending" ? 0.5 : 1 }}
                        >
                          Reject
                        </Button>
                        <Box
                          onClick={() => askDeleteLeave(leave)}
                          sx={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "1px solid #F0B4B9", color: "#D22D3A", borderRadius: "6px", cursor: "pointer", "&:hover": { background: "#FDF0F1" } }}
                        >
                          ✕
                        </Box>
                      </Box>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>

      {isAdmin && (
        <Button sx={{ ...buttonSx.neutral("40px"), marginTop: "18px" }}>
          <CSVLink data={leaves} filename="leaves.csv" style={{ color: "inherit", textDecoration: "none" }}>
            Export as CSV
          </CSVLink>
        </Button>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete leave request"
        message={deleteTarget ? `${deleteTarget.userName}'s ${deleteTarget.leaveType} request will be permanently removed.` : ""}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={confirmDeleteLeave}
        onCancel={cancelDeleteLeave}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEdit ? "Edit Leave Request" : "Add New Leave Request"}</DialogTitle>
        <DialogContent>
          <Select
            margin="dense"
            name="userName"
            fullWidth
            value={form.userName}
            onChange={handleChange}
            disabled={!isAdmin}
            style={{ marginTop: 16 }}
          >
            {users.map((user) => (
              <MenuItem key={user.username} value={user.username}>
                {user.username}
              </MenuItem>
            ))}
          </Select>

          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.startDate}
            onChange={handleChange}
            inputProps={{
              pattern: "\\d{4}-\\d{2}-\\d{2}",
              min: new Date().toISOString().split("T")[0],
            }}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.endDate}
            onChange={handleChange}
            inputProps={{
              pattern: "\\d{4}-\\d{2}-\\d{2}",
              min: form.startDate
                ? moment(form.startDate).format("YYYY-MM-DD")
                : moment().format("YYYY-MM-DD"),
            }}
          />
          <TextField
            margin="dense"
            name="reason"
            label="Reason"
            type="text"
            fullWidth
            value={form.reason}
            onChange={handleChange}
          />
          <Select
            margin="dense"
            name="leaveType"
            fullWidth
            value={form.leaveType}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          >
            <MenuItem value="sick-leave">Sick Leave</MenuItem>
            {form?.startDate &&
              moment(form?.startDate).diff(moment(), "days") >= 5 && (
                <MenuItem value="local-leave">Local Leave</MenuItem>
              )}
            <MenuItem value="emergency-local-leave">
              Emergency Sick Leave
            </MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveLeave}
            variant="contained"
            disabled={!form.startDate || !form.endDate || !form.leaveType}
          >
            {isEdit ? "Update Request" : "Add Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
