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
import { deleteUser, getUsers, updateUser } from "../services/User";
import { userSignUp } from "../services/SignUp";
import { toast } from "react-toastify";
import { COLORS, buttonSx } from "../theme/tokens";
import { AddIcon } from "../Components/common/navIcons";
import ConfirmDialog from "../Components/common/ConfirmDialog";

const roleTagStyle = (role) => {
  const r = String(role).toUpperCase();
  if (r === "ADMIN") return { display: "inline-block", background: COLORS.headerTeal, color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", padding: "5px 11px", borderRadius: "4px" };
  if (r === "STAFF") return { display: "inline-block", background: "#3A4150", color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", padding: "5px 11px", borderRadius: "4px" };
  return { display: "inline-block", background: "#E9EEF2", color: "#3A4150", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", padding: "5px 11px", borderRadius: "4px" };
};

const iconBtnSx = (danger) => ({
  width: 38,
  height: 34,
  minWidth: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  border: `1px solid ${danger ? "#F0B4B9" : COLORS.accentTealBorder}`,
  color: danger ? "#D22D3A" : COLORS.headerTeal,
  borderRadius: "6px",
  cursor: "pointer",
  "&:hover": { background: danger ? "#FDF0F1" : COLORS.accentTealTint },
});

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: ["user"],
    password: "",
  });
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  useEffect(() => {
    async function fetchUsers() {
      const result = await getUsers();
      if (result?.users) {
        setUsers(result?.users);
      } else {
        console.error("Error fetching users:");
      }
    }
    fetchUsers();
  }, [update]);

  const handleOpenDialog = (user = null) => {
    setIsEdit(Boolean(user));
    setSelectedUser(user);
    setForm(
      user
        ? {
            ...user,
            password: "",
            role: Array.isArray(user.role) ? user.role : [user.role],
          }
        : { username: "", email: "", role: ["user"], password: "" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setForm({ username: "", email: "", role: ["user"], password: "" });
  };

  const handleSaveUser = async () => {
    if (isEdit) {
      const result = await updateUser(selectedUser?._id, { ...form });
      if (result?.status === 200) {
        toast?.success(result?.data?.message);
      }
      setUpdate(!update);
    } else {
      const result = await userSignUp({ ...form });
      if (result?.status === 200) {
        toast?.success(result?.data?.message);
      }
      setUpdate(!update);
    }
    handleCloseDialog();
  };

  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteConfirmDialog(true);
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(selectedUser?._id);
    if (result?.status === 200) {
      toast?.success(result?.data?.message);
    }
    setUpdate(!update);
    setDeleteConfirmDialog(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const q = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !q || `${user.username} ${user.email}`.toLowerCase().includes(q);
    const roles = (Array.isArray(user.role) ? user.role : [user.role]).map((r) =>
      String(r).toUpperCase()
    );
    const matchesRole = roleFilter === "All roles" || roles.includes(roleFilter.toUpperCase());
    return matchesSearch && matchesRole;
  });

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "16px" }}>
        <Button
          onClick={() => handleOpenDialog()}
          sx={{ ...buttonSx.primary("46px"), display: "flex", alignItems: "center", gap: "10px", letterSpacing: "0.04em" }}
        >
          <AddIcon size={17} />
          ADD USER
        </Button>
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ height: "46px", boxSizing: "border-box", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", padding: "0 16px", fontSize: "14.5px", width: "420px", maxWidth: "100%", color: COLORS.textPrimary, outline: "none", background: "#fff" }}
        />
        <Box sx={{ flex: 1 }} />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ height: "46px", border: `1px solid ${COLORS.inputBorder}`, borderRadius: "6px", background: "#fff", fontSize: "14.5px", color: COLORS.textPrimary, padding: "0 16px", width: "210px", cursor: "pointer" }}
        >
          {["All roles", "Admin", "Staff", "User"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </Box>

      <Box sx={{ background: "#fff", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", overflowX: "auto", boxShadow: "0 1px 3px rgba(20,26,32,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.tableHeaderBg }}>
              {["Username", "Email", "Role", "Country", "Actions"].map((h, i) => (
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
                    borderRight: i < 4 ? "1px solid rgba(255,255,255,0.12)" : "none",
                    width: h === "Country" ? 150 : h === "Actions" ? 160 : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: COLORS.textFaint, fontSize: "14px" }}>
                  No user matches this search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const roles = Array.isArray(user.role) ? user.role : [user.role];
                return (
                  <tr key={user._id}>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", color: COLORS.textPrimary, textAlign: "center" }}>
                      {user.username}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, fontSize: "14px", color: COLORS.textSecondary }}>
                      {user.email}
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}` }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                        {roles.map((r, i) => (
                          <span key={i} style={roleTagStyle(r)}>{String(r).toUpperCase()}</span>
                        ))}
                      </Box>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}`, textAlign: "center" }}>
                      <span style={{ display: "inline-block", background: COLORS.neutralChipBg, color: COLORS.neutralChipFg, fontSize: "12px", padding: "5px 12px", borderRadius: "5px" }}>
                        {user.country}
                        {user.role === "admin" ? "*" : ""}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.rowBorder}` }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <Box component="button" onClick={() => handleOpenDialog(user)} sx={iconBtnSx(false)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                        </Box>
                        <Box component="button" onClick={() => confirmDeleteUser(user)} sx={iconBtnSx(true)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                        </Box>
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
        open={deleteConfirmDialog}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirmDialog(false)}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            value={form.username}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />
          <Select
            margin="dense"
            name="role"
            fullWidth
            multiple
            value={Array.isArray(form.role) ? form.role : [form.role]}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          >
            <MenuItem value="admin">Group Admin</MenuItem>
            <MenuItem value="user">Group Inventory</MenuItem>
            <MenuItem value="staff">Group Staff</MenuItem>
          </Select>

          <Select
            margin="dense"
            name="country"
            fullWidth
            value={form.country}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          >
            <MenuItem value="MRU">MRU</MenuItem>
            <MenuItem value="MAY">MAY</MenuItem>
          </Select>
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {isEdit ? "Update User" : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
