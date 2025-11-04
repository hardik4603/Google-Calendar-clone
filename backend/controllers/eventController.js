import Event from "../models/eventModel.js";
import { toISTMidnight } from "../utils/dateUtils.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime, timezone, recurrenceType } =
      req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const nowIST = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);

    const start = new Date(startTime);
    const end = new Date(endTime);

    const toIST = (date) => new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    const startIST = toIST(start);
    const endIST = toIST(end);

    const event = await Event.create({
      user: req.user._id,
      title,
      description,
      startTime: startIST,
      endTime: endIST,
      recurrenceType: recurrenceType || "none",
      timezone: timezone || "Asia/Kolkata",
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = { user: req.user._id };

    if (start && end) {
      filter.startTime = { $lte: new Date(end) };
      filter.endTime = { $gte: new Date(start) };
    } else if (start) {
      filter.endTime = { $gte: new Date(start) };
    } else if (end) {
      filter.startTime = { $lte: new Date(end) };
    }

    const events = await Event.find(filter).sort({ startTime: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, user: req.user._id });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updated = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({ _id: id, user: req.user._id });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMonthEvents = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;

    const givenDate = toISTMidnight(new Date(date));

    const startOfMonth = toISTMidnight(
      new Date(givenDate.getFullYear(), givenDate.getMonth(), 1)
    );
    const endOfMonth = toISTMidnight(
      new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, 0)
    );

    const startOfGrid = new Date(startOfMonth);
    startOfGrid.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    const endOfGrid = new Date(endOfMonth);
    endOfGrid.setDate(endOfMonth.getDate() + (6 - endOfMonth.getDay()));

    const events = await Event.find({
      user: userId,
      startTime: { $lte: endOfGrid },
      endTime: { $gte: startOfGrid },
    }).sort({ startTime: 1 });

    const grid = [];
    const today = toISTMidnight(new Date());
    const totalDays =
      Math.ceil((endOfGrid - startOfGrid) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startOfGrid);
      currentDate.setDate(startOfGrid.getDate() + i);

      const dayEvents = events.filter((ev) => {
        const start = new Date(ev.startTime);
        const end = new Date(ev.endTime);

        const toISTDateString = (d) =>
          new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        const currentDateStr = toISTDateString(currentDate);
        const startStr = toISTDateString(start);
        const endStr = toISTDateString(end);

        return currentDateStr >= startStr && currentDateStr <= endStr;
      });

      grid.push({
        date: currentDate,
        events: dayEvents,
        isCurrentDay: currentDate.getTime() === today.getTime(),
        isCurrentMonth: currentDate.getMonth() === givenDate.getMonth(),
      });
    }

    res.status(200).json({
      month: givenDate.toLocaleString("en-IN", {
        month: "long",
        timeZone: "Asia/Kolkata",
      }),
      year: givenDate.getFullYear(),
      totalElements: grid.length,
      grid,
    });
  } catch (error) {
    console.error("Error fetching month events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWeekEvents = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;

    const givenDate = toISTMidnight(new Date(date));

    const startOfWeek = new Date(givenDate);
    startOfWeek.setDate(givenDate.getDate() - givenDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const events = await Event.find({
      user: userId,
      startTime: { $lte: endOfWeek },
      endTime: { $gte: startOfWeek },
    }).sort({ startTime: 1 });

    const today = toISTMidnight(new Date());
    const grid = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dayEvents = events.filter((ev) => {
        const start = new Date(ev.startTime);
        const end = new Date(ev.endTime);
        return currentDate >= start && currentDate <= end;
      });

      grid.push({
        date: currentDate,
        events: dayEvents,
        isCurrentDay: currentDate.getTime() === today.getTime(),
      });
    }

    res.status(200).json({
      weekStart: startOfWeek.toISOString().split("T")[0],
      weekEnd: endOfWeek.toISOString().split("T")[0],
      totalElements: 7,
      grid,
    });
  } catch (error) {
    console.error("Error fetching week events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDayEvents = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const dayStart = toISTMidnight(new Date(date));
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const events = await Event.find({
      user: userId,
      startTime: { $gte: dayStart, $lt: dayEnd },
    }).sort({ startTime: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching day events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};