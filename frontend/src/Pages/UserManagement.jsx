import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { deleteUser, getUsers, updateUser } from "../services/User";
import { userSignUp } from "../services/SignUp";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
  });
  const [update, setUpdate] = useState(false);

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
        ? { ...user, password: "" }
        : { username: "", email: "", role: "User", password: "" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setForm({ username: "", email: "", role: "User", password: "" });
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
    setDeleteConfirmDialog(true); // Open the delete confirmation dialog
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(selectedUser?._id);
    if (result?.status === 200) {
      toast?.success(result?.data?.message);
    }
    setUpdate(!update);
    setDeleteConfirmDialog(false); // Close the delete confirmation dialog
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "16px", width: "100%" }}>
      <Grid container width={"100%"} justifyContent={"flex-start"}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          style={{ marginBottom: "20px" }}
        >
          Add User
        </Button>
      </Grid>

      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "40px" }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.country}
                    {user.role === "admin" ? "*" : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => confirmDeleteUser(user)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit User Dialog */}
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
              value={form.role}
              onChange={handleChange}
              style={{ marginTop: 16 }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmDialog}
          onClose={() => setDeleteConfirmDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default UserManagement;
