import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const JobSheetPopup = ({ open, onClose, onCreate }) => {
  const [jobSheetType, setJobSheetType] = useState("");

  const handleTypeChange = (event) => {
    setJobSheetType(event.target.value);
  };

  const handleCreate = () => {
    onCreate(jobSheetType);
    setJobSheetType(""); // Clear the selected type after creation
    onClose(); // Close the popup
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Job Sheet</DialogTitle>
      <DialogContent
        sx={{
          minWidth: "450px",
          padding: "16px",
        }}
      >
        <InputLabel id="job-sheet-type-label">Type</InputLabel>
        <FormControl fullWidth>
          <Select
            labelId="job-sheet-type-label"
            value={jobSheetType}
            onChange={handleTypeChange}
          >
            <MenuItem value="frappe">Frappe</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px",
        }}
      >
        <Button onClick={onClose} color="error" variant="contained">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!jobSheetType}
          color="primary"
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobSheetPopup;
