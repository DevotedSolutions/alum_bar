import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const OptimizedSheetTable = ({ data }) => {
  const [open, setOpen] = React.useState({});

  const handleToggle = (code) => {
    setOpen((prevState) => ({
      ...prevState,
      [code]: !prevState[code],
    }));
  };

  return (
    <TableContainer component={Paper} style={{ width: "850px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Code</TableCell>
            <TableCell align="right">Total Length (mm)</TableCell>
            <TableCell align="right">Remaining(mm)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <React.Fragment key={row.code}>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => handleToggle(row.code)}
                  >
                    {open[row.code] ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
              {row.optimizedSheet.map((sheet, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell />
                    <TableCell>{`Bar ${index + 1}`}</TableCell>
                    <TableCell align="right">{sheet.Total}</TableCell>
                    <TableCell align="right">{sheet.Wastage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={5}
                    >
                      <Collapse
                        in={open[row.code]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Table size="small" aria-label="Bars">
                            <TableHead>
                              <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Length</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sheet.Bars.map((bar, barIndex) => (
                                <TableRow key={barIndex}>
                                  <TableCell>{bar.Quantity}</TableCell>
                                  <TableCell>{bar.Length}</TableCell>
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
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OptimizedSheetTable;
