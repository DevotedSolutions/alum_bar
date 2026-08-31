import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { COLORS } from "../../theme/tokens";

/**
 * Shared delete/destructive-action confirmation dialog, styled to match
 * the redesign's modal look. Replaces the per-page duplicated confirm
 * dialogs (and the raw window.confirm in UpdateCombo.jsx).
 *
 * Props:
 *  - open: boolean
 *  - title: string (e.g. "Delete product")
 *  - message: string | node
 *  - confirmLabel / cancelLabel: string
 *  - onConfirm / onCancel: () => void
 *  - danger: boolean (default true) — red confirm button vs teal
 */
export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Keep it",
  onConfirm,
  onCancel,
  danger = true,
}) {
  return (
    <Dialog
      open={!!open}
      onClose={onCancel}
      PaperProps={{ sx: { borderRadius: "8px", width: 420, maxWidth: "100%" } }}
    >
      <Box
        sx={{
          background: COLORS.tableHeaderBg,
          padding: "15px 20px",
          color: "#fff",
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Box>
      <Box sx={{ padding: "20px" }}>
        <Typography
          sx={{ fontSize: "14px", color: COLORS.textSecondary, lineHeight: 1.6 }}
        >
          {message}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          padding: "0 20px 20px",
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            height: "42px",
            background: "#fff",
            border: `1px solid ${COLORS.inputBorder}`,
            color: "#2C323A",
            borderRadius: "6px",
            padding: "0 18px",
            fontSize: "13.5px",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { borderColor: COLORS.headerTeal, color: COLORS.headerTeal },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            height: "42px",
            background: danger ? "#D22D3A" : COLORS.headerTeal,
            color: "#fff",
            borderRadius: "6px",
            padding: "0 20px",
            fontSize: "13.5px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { background: danger ? "#B02430" : COLORS.headerTealHover },
          }}
        >
          {confirmLabel}
        </Button>
      </Box>
    </Dialog>
  );
}
