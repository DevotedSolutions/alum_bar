const Event = require("../model/eventSchema");
const Leave = require("../model/leaveSchema");

const allowedLeaves = {
  sick: 22,
  local: 15,
};

exports.getEventsByCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const events = await Event.find({ country });

    if (!events || events.length === 0) {
      res.status(200).json({ message: "No events found", events: [] });
    } else {
      res
        .status(200)
        .json({ message: "Events retrieved successfully", events });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMarkersByCountry = async (req, res) => {
  const { country } = req.params;

  try {
    const markers = await Event.find({ country });

    if (!markers || markers.length === 0) {
      return res
        .status(200)
        .json({ message: "No markers found for this country", markers: [] });
    } else {
      const filteredMarkers = markers.filter(
        (marker) => marker.location && marker.location.length === 2
      );
      res.status(200).json({
        message: "Markers retrieved successfully",
        markers: filteredMarkers,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addEventByCountry = async (req, res) => {
  const { title, start, end, type, description, location, address, country } =
    req.body;

  try {
    const newEvent = new Event({
      title,
      start,
      end,
      type,
      description,
      location,
      address,
      country,
    });

    const savedEvent = await newEvent.save();

    res
      .status(201)
      .json({ message: "Event added successfully", event: savedEvent });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editEvent = async (req, res) => {
  const { _id, title, start, end, type, description, location, address } =
    req.body;

  try {
    const updateData = {
      title,
      start,
      end,
      type,
      description,
      location,
      address,
    };

    const eventId = _id;

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      updateData,
      { new: true }
    );

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ message: "Event not found for this country" });
    } else {
      res
        .status(200)
        .json({ message: "Event updated successfully", event: updatedEvent });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(_id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    } else {
      res
        .status(200)
        .json({ message: "Event deleted successfully", event: deletedEvent });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLeaves = async (req, res) => {
  const { startDate, endDate, appliedAt, status, userId, leaveType } = req.body;

  try {
    const filter = {};

    if (startDate) {
      filter.startDate = { $gte: new Date(startDate) };
    }

    if (endDate) {
      filter.endDate = { $lte: new Date(endDate) };
    }

    if (appliedAt) {
      filter.appliedAt = { $gte: new Date(appliedAt) };
    }

    if (userId) {
      filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    if (leaveType) {
      filter.leaveType = leaveType;
    }

    const leaves = await Leave.find(filter);

    if (!leaves || leaves.length === 0) {
      res.status(200).json({ message: "No leaves found", leaves: [] });
    } else {
      res
        .status(200)
        .json({ message: "Leaves retrieved successfully", leaves });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

exports.addLeave = async (req, res) => {
  const { userId, userName, startDate, endDate, reason, leaveType } = req.body;

  try {
    const newLeave = new Leave({
      userId,
      userName,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    const leaveSummary = await calculateLeaves(userId);

    if (leaveType === "sick" && leaveSummary.sick.available <= days) {
      res.status(200).json({
        message: `You only have ${leaveSummary.sick.available} available sick leaves. Kindly, contact your manager.`,
      });
    } else if (leaveType === "local" && leaveSummary.local.available <= days) {
      res.status(200).json({
        message: `You only have ${leaveSummary.local.available} available local leaves. Kindly, contact your manager.`,
      });
    } else {
      const savedLeave = await newLeave.save();

      res
        .status(201)
        .json({ message: "Leave added successfully", leave: savedLeave });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

exports.editLeave = async (req, res) => {
  const { _id, userName, startDate, endDate, reason, status, leaveType } =
    req.body;

  try {
    const updateData = {
      startDate,
      endDate,
      reason,
      status,
      leaveType,
      userName,
    };

    const leaveId = _id;

    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId },
      updateData,
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    } else {
      res
        .status(200)
        .json({ message: "Leave updated successfully", leave: updatedLeave });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

calculateLeaves = async (userId, days) => {
  try {
    const currentYear = new Date().getFullYear();

    const leaves = await Leave.find({
      userId: userId,
      startDate: { $gte: new Date(`${currentYear}-01-01`) },
      endDate: { $lte: new Date(`${currentYear}-12-31`) },
      status: { $in: ["Pending", "Approved"] },
    });

    const leaveSummary = {
      sick: { used: 0, available: allowedLeaves?.sick },
      local: { used: 0, available: allowedLeaves?.local },
    };

    leaves.forEach((leave) => {
      if (leave.leaveType === "sick") {
        leaveSummary.sick.used +=
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24) +
          1;
      } else if (leave.leaveType === "local") {
        leaveSummary.local.used +=
          (new Date(leave.endDate) - new Date(leave.startDate)) /
            (1000 * 60 * 60 * 24) +
          1;
      }
    });

    leaveSummary.sick.available -= leaveSummary.sick.used;
    leaveSummary.local.available -= leaveSummary.local.used;

    return leaveSummary;
  } catch (error) {
    return null;
  }
};
