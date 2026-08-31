import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { COLORS } from "../../theme/tokens";

const headCellSx = { color: "#fff", fontWeight: 700, fontSize: "12px", letterSpacing: "0.07em", textTransform: "uppercase" };

const GlazzingTable = ({ data }) => {
  const [open, setOpen] = useState({});

  const handleToggle = (id) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TableContainer component={Paper} sx={{ width: "850px", border: `1px solid ${COLORS.cardBorder}`, borderRadius: "8px", boxShadow: "0 1px 3px rgba(20,26,32,0.05)" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: COLORS.tableHeaderBg }}>
            <TableCell sx={headCellSx} />
            <TableCell sx={headCellSx}>Glazzing</TableCell>
            <TableCell sx={headCellSx}>Quantity</TableCell>
            <TableCell sx={headCellSx}>Width</TableCell>
            <TableCell sx={headCellSx}>Height</TableCell>
            <TableCell sx={headCellSx}>Repere</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <TableCell>
                  <IconButton size="small" onClick={() => handleToggle(row.id)}>
                    {open[row.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell>{row.glazzing}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.width}</TableCell>
                <TableCell>{row.height}</TableCell>
                <TableCell>{row.repere}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={7}
                >
                  <Collapse in={open[row.id]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Width</TableCell>
                            <TableCell>Height</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.glazzingValues.map((value) => (
                            <TableRow key={value._id}>
                              <TableCell>{value.code}</TableCell>
                              <TableCell>{value.quantity}</TableCell>
                              <TableCell>{value.width}</TableCell>
                              <TableCell>{value.height}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GlazzingTable;
