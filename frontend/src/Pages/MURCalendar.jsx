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
  addLeave,
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
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentEvent(null);
    setOpenDialog(false);
  };

  const getEventStyle = (type) => {
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
        return { backgroundColor: "#0096FF" };
      case "container-departure":
        return { backgroundColor: "#00008B" };
      case "site-work":
        return { backgroundColor: "#0000FF" };
      default:
        return { backgroundColor: "#9e9e9e" };
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
        selectable
      />
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

            {currentEvent?.start &&
              moment(currentEvent.start).diff(moment(), "days") >= 5 && (
                <MenuItem value="local-leave">Local Leave</MenuItem>
              )}
            <MenuItem value="emergency-local-leave">
              Emergency Local Leave
            </MenuItem>
            <MenuItem value="sick-leave">Sick Leave</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>

            {isAdmin && <MenuItem value="other">Other</MenuItem>}
          </TextField>

          {currentEvent?.type === "other" && (
            <TextField
              label="Specify Other Type"
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
            type="datetime-local"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
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
            inputProps={{
              min: moment().format("YYYY-MM-DDTHH:mm"),
            }}
          />
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            disabled={!isAdmin && currentEvent?._id}
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
            inputProps={{
              min: currentEvent?.start
                ? moment(currentEvent.start).format("YYYY-MM-DDTHH:mm")
                : moment().format("YYYY-MM-DDTHH:mm"),
            }}
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

      <MapComponent
        onOpen={handleOpenDialog}
        update={update}
        country={country}
        key={country}
      />
    </div>
  );
};

export default CustomCalendar;
