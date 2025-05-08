import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import MapComponent from "../Components/calendar/Map";
import {
  addEventByCountry,
  deleteEvent,
  getEventsByCountry,
  updateEvent,
} from "../services/Events";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

const CustomCalendar = () => {
  const [events, setEvents] = useState([]);

  const [country, setCountry] = useState(
    window.localStorage.getItem("UserCountry")
  );

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEventsByCountry(country ?? "");
        console.log(fetchedEvents);
        toast.success(fetchedEvents?.message);
        setEvents(fetchedEvents?.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [!update, country]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const isAdmin = window.localStorage.getItem("UserRole") === "admin";

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
      const response = await addEventByCountry({
        ...currentEvent,
        country,
      });

      toast.success(response?.message);
      setUpdate(!update);

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

  const handleOpenDialog = (event = null) => {
    setCurrentEvent({
      _id: event?._id || null,
      title: event?.title || "",
      description: event?.description || "",
      type: event?.type || "",
      address: event?.address || "",
      start: event?.start || "",
      end: event?.end || "",
      location: event?.location || null,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentEvent(null);
    setOpenDialog(false);
  };

  const getEventStyle = (type) => {
    switch (type) {
      case "leave":
        return { backgroundColor: "#f44336" }; // Red for leave
      case "container arrival":
        return { backgroundColor: "#2196f3" }; // Blue for arrival
      case "container departure":
        return { backgroundColor: "#ff9800" }; // Orange for departure
      case "site work":
        return { backgroundColor: "#4caf50" }; // Green for site work
      default:
        return { backgroundColor: "#9e9e9e" }; // Gray for others
    }
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "0px 16px",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{
          display: isAdmin ? "block" : "none",
        }}
      >
        Add Event
      </Button>

      {isAdmin && (
        <div
          style={{
            margin: "20px 0",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant={country === "MRU" ? "contained" : "outlined"}
            onClick={() => setCountry("MRU")}
            sx={{
              borderRadius: "0px",
            }}
          >
            Mauritius
          </Button>
          <Button
            variant={country === "MAY" ? "contained" : "outlined"}
            onClick={() => setCountry("MAY")}
            sx={{
              borderRadius: "0px",
            }}
          >
            Mayotte
          </Button>
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={events?.map((event) => ({
          ...event,
          title: `${event?.location?.length > 0 ? "*" : ""} ${event?.title}`,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px 0", width: "100%" }}
        eventPropGetter={(event) => ({
          style: getEventStyle(event.type),
        })}
        onSelectEvent={(event) => handleOpenDialog(event)}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentEvent?._id ? "Event Detail" : "Add New Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            disabled={!isAdmin}
            margin="dense"
            value={currentEvent?.title || ""}
            onChange={(e) =>
              setCurrentEvent({ ...currentEvent, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            disabled={!isAdmin}
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
            disabled={!isAdmin}
            margin="dense"
            value={currentEvent?.type || ""}
            onChange={(e) =>
              setCurrentEvent({ ...currentEvent, type: e.target.value })
            }
          >
            {/* <MenuItem value="leave">Leave</MenuItem> */}
            <MenuItem value="container arrival">Container Arrival</MenuItem>
            <MenuItem value="container departure">Container Departure</MenuItem>
            <MenuItem value="site work">Site Work</MenuItem>
          </TextField>

          {currentEvent?.location && currentEvent?.location?.length > 0 && (
            <>
              <TextField
                label="Latitude"
                fullWidth
                disabled={!isAdmin}
                margin="dense"
                value={currentEvent?.location[0] || ""}
              />

              <TextField
                label="Longitude"
                fullWidth
                disabled={!isAdmin}
                margin="dense"
                value={currentEvent?.location[1] || ""}
              />

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
            type="datetime-local"
            fullWidth
            disabled={!isAdmin}
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={
              currentEvent?.start
                ? moment(currentEvent.start).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={(e) =>
              setCurrentEvent({
                ...currentEvent,
                start: new Date(e.target.value),
              })
            }
          />
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            disabled={!isAdmin}
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={
              currentEvent?.end
                ? moment(currentEvent.end).format("YYYY-MM-DDTHH:mm")
                : ""
            }
            onChange={(e) =>
              setCurrentEvent({
                ...currentEvent,
                end: new Date(e.target.value),
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
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
              display: isAdmin ? "block" : "none",
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

      <MapComponent
        onOpen={handleOpenDialog}
        update={update}
        country={country}
        key={country} // Force re-render when country changes
      />
    </div>
  );
};

export default CustomCalendar;
