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
  Chip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { deleteUser, getUsers, updateUser } from "../services/User";
import { userSignUp } from "../services/SignUp";
import { toast } from "react-toastify";
import {
  addEventByCountry,
  addLeave,
  editLeave,
  getLeaves,
} from "../services/Events";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedLeave, setselectedLeave] = useState(null);
  const [form, setForm] = useState({
    userId: window.localStorage.getItem("UserId"),
    userName: window.localStorage.getItem("UserName"),
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });
  const [update, setUpdate] = useState(false);
  const isAdmin = window.localStorage.getItem("UserRole") === "admin";

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

    if (isAdmin) {
      fetchUsers();
    }
    fetchLeaves();
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
      userame: window.localStorage.getItem("UserName"),
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

    if (isEdit) {
      //   const result = await updateUser(selectedLeave?._id, { ...form });
      //   if (result?.status === 200) {
      //     toast?.success(result?.data?.message);
      //   }
      //   setUpdate(!update);
    } else {
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
          type: "leave",
          start: new Date(leave.startDate).toISOString(),
          end: new Date(leave.endDate).toISOString(),
          country: window.localStorage.getItem("UserCountry"),
        });
        toast?.success(addEvent?.message);
      }
      setUpdate(!update);
      handleCloseDialog();
    }
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(selectedLeave?._id);
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
          Apply Leave
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
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Applied At</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Status</TableCell>
                {isAdmin && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell>{leave?.userName}</TableCell>
                  <TableCell>
                    {new Date(leave?.startDate).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {new Date(leave?.endDate).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {new Date(leave?.appliedAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{leave?.reason}</TableCell>
                  <TableCell>{leave?.leaveType}</TableCell>
                  <TableCell>
                    <Chip
                      label={leave?.status}
                      color={
                        leave?.status === "Approved"
                          ? "success"
                          : leave?.status === "Pending"
                          ? "default"
                          : "error"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      display: isAdmin ? "block" : "none",
                    }}
                  >
                    <Button
                      onClick={() =>
                        handleLeaveStatus({
                          ...leave,
                          status: "Approved",
                        })
                      }
                      color="success"
                      variant="contained"
                      disabled={leave?.status !== "Pending"}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() =>
                        handleLeaveStatus({
                          ...leave,
                          status: "Rejected",
                        })
                      }
                      color="error"
                      variant="contained"
                      sx={{ mt: "4px" }}
                      disabled={leave?.status !== "Pending"}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {isEdit ? "Edit Leave Request" : "Add New Leave Request"}
          </DialogTitle>
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
              inputProps={{ pattern: "\\d{4}-\\d{2}-\\d{2}" }}
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
              inputProps={{ pattern: "\\d{4}-\\d{2}-\\d{2}" }}
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
              <MenuItem value="sick">Sick</MenuItem>
              <MenuItem value="local">Local</MenuItem>
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
