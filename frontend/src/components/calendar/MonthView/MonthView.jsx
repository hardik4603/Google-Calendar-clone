import React, { useState, useEffect, useRef } from "react";
import "./MonthView.scss";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import { useEvent } from "../../../context/EventContext";

const MonthView = () => {
  const { events, selectedDate } = useEvent();
  const [gridData, setGridData] = useState([]);
  const [rowHeights, setRowHeights] = useState([]);
  const containerRef = useRef(null);

  const buildMonthGrid = (date, eventsList) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      const d = new Date(year, month, i - startDay + 1);
      days.push({
        date: d,
        isCurrentMonth: false,
        isCurrentDay: false,
        events: [],
      });
    }
    const formatISTDate = (date) => {
      const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
      return ist.toISOString().split("T")[0];
    };

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const isoDate = d.toISOString().split("T")[0];
      const dayEvents = eventsList.filter((ev) => {
        const eventDate = formatISTDate(new Date(ev.startTime));
        return eventDate === formatISTDate(d);
      });

      days.push({
        date: d,
        isCurrentMonth: true,
        isCurrentDay: d.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
    }

    // Fill next month days to complete the grid (42 cells typical)
    const totalCells = 42;
    const nextDays = totalCells - days.length;
    for (let i = 1; i <= nextDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        isCurrentDay: false,
        events: [],
      });
    }

    return days;
  };

  // whenever events or selectedDate change, rebuild grid
  useEffect(() => {
    if (selectedDate) {
      setGridData(buildMonthGrid(selectedDate, events));
    }
  }, [events, selectedDate]);

  // Dynamic row heights
  useEffect(() => {
    if (containerRef.current && gridData.length > 0) {
      const containerHeight = containerRef.current.clientHeight;
      const totalRows = Math.ceil(gridData.length / 7);
      const equalHeight = containerHeight / totalRows;
      const adjustedFirstRow = equalHeight + 10;
      const remainingHeight = containerHeight - adjustedFirstRow;
      const otherRowHeight = remainingHeight / (totalRows - 1);

      const heights = Array.from({ length: totalRows }, (_, i) =>
        i === 0 ? adjustedFirstRow : otherRowHeight
      );

      setRowHeights(heights);
    }
  }, [gridData]);

  return (
    <div className="month-view" ref={containerRef}>
      <div
        className="month-view-grid"
        style={{
          gridTemplateRows: rowHeights.map((h) => `${h}px`).join(" "),
        }}
      >
        {gridData.map((dayData, index) => (
          <CalendarGrid
            key={index}
            index={index}
            date={new Date(dayData.date)}
            isCurrentMonth={dayData.isCurrentMonth}
            isToday={dayData.isCurrentDay}
            events={dayData.events}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthView;