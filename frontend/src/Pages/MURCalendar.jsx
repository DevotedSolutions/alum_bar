import React, { useState, useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import MapComponent from "../Components/calendar/Map";
import CalendarToolbar from "../Components/calendar/CalendarToolbar";
import { AddIcon } from "../Components/common/navIcons";
import {
  addEventByCountry,
  deleteEvent,
  getEventsByCountry,
  updateEvent,
  addLeave,
  completeEvent,
} from "../services/Events";
import { toast } from "react-toastify";
import { useRegion } from "../Components/common/RegionContext";
import { COLORS, buttonSx } from "../theme/tokens";

const localizer = momentLocalizer(moment);

// 20 mutually-distinct, colorblind-safe colors (Sasha Trubetskoy's "20 simple
// distinct colors" set) — chosen so hue alone is never the only thing telling
// two colors apart, which keeps them distinguishable under red-green and
// blue-yellow color blindness.
const COLOR_PALETTE = [
  { name: "Red", hex: "#e6194b" },
  { name: "Green", hex: "#3cb44b" },
  { name: "Yellow", hex: "#ffe119" },
  { name: "Blue", hex: "#4363d8" },
  { name: "Orange", hex: "#f58231" },
  { name: "Purple", hex: "#911eb4" },
  { name: "Cyan", hex: "#46f0f0" },
  { name: "Magenta", hex: "#f032e6" },
  { name: "Lime", hex: "#bcf60c" },
  { name: "Pink", hex: "#fabebe" },
  { name: "Teal", hex: "#008080" },
  { name: "Lavender", hex: "#e6beff" },
  { name: "Brown", hex: "#9a6324" },
  { name: "Cream", hex: "#fffac8" },
  { name: "Maroon", hex: "#800000" },
  { name: "Mint", hex: "#aaffc3" },
  { name: "Olive", hex: "#808000" },
  { name: "Apricot", hex: "#ffd8b1" },
  { name: "Navy", hex: "#000075" },
  { name: "Grey", hex: "#808080" },
];

const COMPLETED_COLOR = "#2ECC71";

const formatTypeLabel = (type) =>
  (type || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getEventTypeLabel = (event) =>
  event?.type === "other" && event?.otherType
    ? event.otherType
    : formatTypeLabel(event?.type);

// Picks black or white text so it stays readable against any palette color,
// including the pale ones (Cream, Mint, Lavender, ...).
const getContrastTextColor = (hex) => {
  if (!hex) return "#fff";
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#fff";
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#1A1A1A" : "#FFFFFF";
};

const CustomCalendar = () => {
  const [events, setEvents] = useState([]);

  const { region: country } = useRegion();

  const [update, setUpdate] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEventsByCountry(country ?? "");
        console.log(fetchedEvents);
        toast.success(fetchedEvents?.message);
        setEvents(
          fetchedEvents?.events?.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [!update, country]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const isAdmin =
    window.localStorage.getItem("UserRole") === "admin" ||
    window.localStorage.getItem("UserRole")?.includes("admin");

  const handleAddEvent = async () => {
    if (currentEvent?._id) {
      const response = await updateEvent({
        ...currentEvent,
        country,
      });

      toast.success(response?.message);
      setUpdate(!update);
      // Editing an existing event
      // setEvents(
      //   events.map((event) =>
      //     event.id === currentEvent.id
      //       ? { ...currentEvent, style: eventStyle }
      //       : event
      //   )
      // );
    } else {
      if (
        currentEvent?.type?.includes("leave") ||
        currentEvent?.type === "absent"
      ) {
        const result = await addLeave({
          userName: window.localStorage.getItem("UserName"),
          userId: window.localStorage.getItem("UserId"),
          startDate: currentEvent.start,
          endDate: currentEvent.end,
          reason: currentEvent?.description,
          leaveType: currentEvent?.type,
        });
        if (result?.leave) {
          toast?.success(result?.message);
          const response = await addEventByCountry({
            ...currentEvent,
            type:
              currentEvent?.type === "other"
                ? currentEvent?.otherType
                : currentEvent?.type,
            country,
          });

          toast.success(response?.message);
          setUpdate(!update);
        } else {
          toast?.error(result?.message);
        }
      } else {
        const response = await addEventByCountry({
          ...currentEvent,
          country,
        });

        toast.success(response?.message);
        setUpdate(!update);
      }

      // Adding a new event
      // setEvents([
      //   ...events,
      //   { ...currentEvent, id: events.length + 1, style: eventStyle },
      // ]);
    }
    handleCloseDialog();
  };

  const handleDeleteEvent = async () => {
    if (currentEvent?._id) {
      const response = await deleteEvent(currentEvent._id);
      toast.success(response?.message);
      setUpdate(!update);
    }
    handleCloseDialog();
  };

  const handleCompleteEvent = async () => {
    if (currentEvent?._id) {
      const response = await completeEvent(currentEvent._id);
      toast.success(response?.message);
      setUpdate(!update);
    }
    handleCloseDialog();
  };

  const handleOpenDialog = (event = null) => {
    setCurrentEvent({
      _id: event?._id || null,
      title: event?.title || "",
      description: event?.description || "",
      type: event?.type || "",
      otherType: event?.otherType || "",
      address: event?.address || "",
      start: event?.start || "",
      end: event?.end || "",
      location: event?.location || null,
      note: event?.note || "",
      completed: event?.completed || false,
      color: event?.color || COLOR_PALETTE[0].hex,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentEvent(null);
    setOpenDialog(false);
  };

  const getEventStyle = (type, completed, color) => {
    if (completed) {
      return { backgroundColor: "#2ECC71" };
    }

    if (color) {
      return { backgroundColor: color };
    }

    switch (type) {
      case "local-leave":
        return { backgroundColor: "#2E6F40" };
      case "emergency-local-leave":
        return { backgroundColor: "#f805f8" };
      case "sick-leave":
        return { backgroundColor: "#BA8E23" };
      case "absent":
        return { backgroundColor: "#ff0000" };
      case "container-arrival":
        return { backgroundColor: "#FF9800" };
      case "container-departure":
        return { backgroundColor: "#FF9800" };
      case "site-work":
        return { backgroundColor: "#0000FF" };
      case "reparation":
        return { backgroundColor: "#FFC107" };
      case "measurement":
        return { backgroundColor: "#9C27B0" };
      case "other":
        return { backgroundColor: "#9e9e9e" };
      default:
        return { backgroundColor: "#9e9e9e" };
    }
  };

  const getIsLeave = (type) => {
    switch (type) {
      case "local-leave":
        return true;
      case "emergency-local-leave":
        return true;
      case "sick-leave":
        return true;
      case "absent":
        return true;
      default:
        return false;
    }
  };

  const legendItems = useMemo(() => {
    const seen = new Map();
    let hasCompleted = false;

    (events || []).forEach((event) => {
      if (event?.completed) {
        hasCompleted = true;
      }
      const label = getEventTypeLabel(event);
      const color = event?.color || getEventStyle(event?.type, false, null).backgroundColor;
      if (!label) return;
      const key = `${label}|${color}`;
      if (!seen.has(key)) {
        seen.set(key, { label, color });
      }
    });

    const items = Array.from(seen.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    if (hasCompleted) {
      items.push({ label: "Completed", color: COMPLETED_COLOR });
    }

    return items;
  }, [events]);

  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "16px" }}>
        {isAdmin && (
          <Button
            onClick={() => handleOpenDialog()}
            sx={{ ...buttonSx.primary("46px"), display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, letterSpacing: "0.04em" }}
          >
            <AddIcon size={17} />
            ADD EVENT
          </Button>
        )}

        {isAdmin && (
          <Button onClick={() => setShowMap(!showMap)} sx={buttonSx.neutral("46px")}>
            {!showMap ? "Show" : "Hide"} Map
          </Button>
        )}
      </Box>

      {showMap ? (
        <MapComponent
          onOpen={handleOpenDialog}
          update={update}
          country={country}
          key={country}
          isAdmin={isAdmin}
        />
      ) : null}

      <style>
        {`
          .rbc-calendar-shell .rbc-month-row { min-height: 168px; }
          .rbc-calendar-shell .rbc-event {
            padding: 6px 9px !important;
            font-size: 12px !important;
            min-height: 28px !important;
            border-radius: 4px !important;
            border: none !important;
          }
          .rbc-calendar-shell .rbc-event-content { white-space: normal !important; line-height: 1.2; font-weight: 700; }
          .rbc-calendar-shell .rbc-header {
            padding: 13px 0 !important;
            font-size: 12.5px;
            font-weight: 700;
            letter-spacing: 0.07em;
            color: #3A4150;
            border-right: 1px solid #EDEFF2 !important;
            border-bottom: none !important;
          }
          .rbc-calendar-shell .rbc-month-header { border-bottom: 2px solid ${COLORS.headerTeal}; }
          .rbc-calendar-shell .rbc-off-range-bg { background: #FAFBFC; }
          .rbc-calendar-shell .rbc-day-bg, .rbc-calendar-shell .rbc-month-row { border-color: #EDEFF2 !important; }
          .rbc-calendar-shell .rbc-month-view { border: none; }
          .rbc-calendar-shell .rbc-today { background: #EEF8F9; }
          .rbc-calendar-shell { background: #fff; border: 1px solid #E4E7EA; border-top: none; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px rgba(20,26,32,0.05); overflow: hidden; }
        `}
      </style>
      <Box className="rbc-calendar-shell">
        <Calendar
          localizer={localizer}
          components={{ toolbar: CalendarToolbar }}
          views={["month", "week", "day", "agenda"]}
          events={events?.map((event) => ({
            ...event,
            title: `${event?.location?.length > 0 ? "*" : ""} ${event?.title}`,
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 900, width: "100%" }}
          eventPropGetter={(event) => {
            const eventStyle = getEventStyle(
              event.type,
              event.completed,
              event.color
            );
            return {
              style: {
                ...eventStyle,
                color: getContrastTextColor(eventStyle.backgroundColor),
                minHeight: 28,
                padding: "6px 9px",
                fontSize: "12px",
              },
            };
          }}
          onSelectEvent={(event) => {
            handleOpenDialog(event);
          }}
          onSelectSlot={(slotInfo) => {
            if (moment(slotInfo.start).isSameOrAfter(moment(), "day")) {
              handleOpenDialog({
                start: slotInfo.start,
                end: slotInfo.end,
              });
            }
          }}
          // onSelectSlot={(slotInfo) => {
          //   if (moment(slotInfo.start).isSameOrAfter(moment(), "day")) {
          //     handleOpenDialog({
          //       start: slotInfo.start,
          //       end: slotInfo.end,
          //     });
        //   }
        // }}
          selectable
          longPressThreshold={10}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "26px", padding: "16px 4px 0", flexWrap: "wrap" }}>
        {legendItems.length === 0 && (
          <span style={{ fontSize: "13.5px", color: "#8A909B" }}>
            No events yet — add one to see it listed here.
          </span>
        )}
        {legendItems.map((l) => (
          <Box key={`${l.label}|${l.color}`} sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <span style={{ width: 11, height: 11, minWidth: 11, borderRadius: "50%", background: l.color, display: "inline-block", border: "1px solid rgba(0,0,0,0.15)" }} />
            <span style={{ fontSize: "13.5px", color: "#3A4150" }}>{l.label}</span>
          </Box>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentEvent?._id ? "Event Detail" : "Add New Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
            margin="dense"
            value={currentEvent?.title || ""}
            onChange={(e) =>
              setCurrentEvent({ ...currentEvent, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
            multiline
            InputLabelProps={{ shrink: true }}
            margin="dense"
            value={currentEvent?.description || ""}
            onChange={(e) =>
              setCurrentEvent({ ...currentEvent, description: e.target.value })
            }
          />
          <TextField
            label="Event Type"
            select
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
            margin="dense"
            value={currentEvent?.type || ""}
            onChange={(e) =>
              setCurrentEvent({ ...currentEvent, type: e.target.value })
            }
          >
            {isAdmin && (
              <MenuItem value="container-arrival">Container Arrival</MenuItem>
            )}

            {isAdmin && (
              <MenuItem value="container-departure">
                Container Departure
              </MenuItem>
            )}

            {isAdmin && <MenuItem value="site-work">Site Work</MenuItem>}

            {isAdmin && <MenuItem value="reparation">Reparation</MenuItem>}

            {isAdmin && <MenuItem value="measurement">Measurement</MenuItem>}

            {!currentEvent?.location &&
              currentEvent?.start &&
              moment(currentEvent.start).diff(moment(), "days") >= 5 && (
                <MenuItem value="local-leave">Local Leave</MenuItem>
              )}

            {(!currentEvent?.location ||
              currentEvent?.location?.length === 0) && (
              <MenuItem value="emergency-local-leave">
                Emergency Local Leave
              </MenuItem>
            )}
            {!currentEvent?.location ||
              (currentEvent?.location?.length === 0 && (
                <MenuItem value="sick-leave">Sick Leave</MenuItem>
              ))}

            {(!currentEvent?.location ||
              currentEvent?.location?.length === 0) && (
              <MenuItem value="absent">Absent</MenuItem>
            )}

            {isAdmin && <MenuItem value="other">Custom</MenuItem>}
          </TextField>

          {currentEvent?.type === "other" && (
            <TextField
              label="Custom Event Type"
              placeholder="Enter a name for this event type"
              fullWidth
              margin="dense"
              value={currentEvent?.otherType || ""}
              onChange={(e) =>
                setCurrentEvent({ ...currentEvent, otherType: e.target.value })
              }
            />
          )}

          {currentEvent?.location && currentEvent?.location?.length > 0 && (
            <>
              <TextField
                label="Address"
                fullWidth
                disabled={!isAdmin}
                margin="dense"
                value={currentEvent?.address || ""}
                onChange={(e) =>
                  setCurrentEvent({ ...currentEvent, address: e.target.value })
                }
              />
            </>
          )}

          <TextField
            label="Start Date"
            type="date"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={
              currentEvent?.start
                ? moment(currentEvent.start).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) =>
              setCurrentEvent({
                ...currentEvent,
                start: new Date(e.target.value),
              })
            }
            inputProps={{
              min: moment().format("YYYY-MM-DD"),
            }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={
              currentEvent?.end
                ? moment(currentEvent.end).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) =>
              setCurrentEvent({
                ...currentEvent,
                end: new Date(e.target.value),
              })
            }
            inputProps={{
              min: currentEvent?.start
                ? moment(currentEvent.start).format("YYYY-MM-DD")
                : moment().format("YYYY-MM-DD"),
            }}
          />
          <TextField
            label="Note"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
            multiline
            InputLabelProps={{ shrink: true }}
            margin="dense"
            value={currentEvent?.note || ""}
            onChange={(e) =>
              setCurrentEvent({ ...currentEvent, note: e.target.value })
            }
          />
          <Box sx={{ marginTop: "10px" }}>
            <Box sx={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", marginBottom: "6px" }}>
              Event Color
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {COLOR_PALETTE.map((swatch) => {
                const isSelected = currentEvent?.color === swatch.hex;
                const disabled = !isAdmin && currentEvent?._id;
                return (
                  <Box
                    key={swatch.hex}
                    component="button"
                    type="button"
                    title={swatch.name}
                    aria-label={swatch.name}
                    disabled={disabled}
                    onClick={() =>
                      setCurrentEvent({ ...currentEvent, color: swatch.hex })
                    }
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: swatch.hex,
                      border: isSelected
                        ? "3px solid #08999D"
                        : "1px solid rgba(0,0,0,0.2)",
                      boxShadow: isSelected
                        ? "0 0 0 1px #fff inset"
                        : "none",
                      cursor: disabled ? "default" : "pointer",
                      opacity: disabled ? 0.5 : 1,
                      padding: 0,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          {currentEvent?._id && !currentEvent?.completed && (
            <Button
              onClick={handleCompleteEvent}
              variant="contained"
              sx={{
                display: isAdmin ? "block" : "none",
                backgroundColor: "#2ECC71",
                "&:hover": { backgroundColor: "#27AE60" },
              }}
            >
              Mark Complete
            </Button>
          )}

          {currentEvent?._id && (
            <Button
              onClick={handleDeleteEvent}
              variant="contained"
              color="error"
              sx={{
                display: isAdmin ? "block" : "none",
              }}
            >
              Delete
            </Button>
          )}

          <Button
            onClick={handleAddEvent}
            color="primary"
            variant="contained"
            sx={{
              display: isAdmin ? "block" : currentEvent?._id ? "none" : "block",
            }}
            disabled={
              currentEvent?.title?.length === 0 ||
              !currentEvent?.start ||
              !currentEvent?.end ||
              !currentEvent?.type
            }
          >
            {currentEvent?._id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomCalendar;
