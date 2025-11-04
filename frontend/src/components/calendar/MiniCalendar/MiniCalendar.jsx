import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./MiniCalendar.scss";
import { useEvent } from "../../../context/EventContext";

const MiniCalendar = () => {
  const { selectedDate, setSelectedDate } = useEvent();

  // 🟢 local month/year state for viewing only
  const [viewDate, setViewDate] = useState(selectedDate);

  useEffect(() => {
    // Whenever global date changes, sync view month to it
    setViewDate(selectedDate);
  }, [selectedDate]);

  const today = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  // 🟢 Arrows only change local month
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // 🟢 Clicking a date updates global selectedDate
  const handleDayClick = (day) => {
    setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  };

  const renderCalendarDays = () => {
    const days = [];
    const prevMonthDays = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      0
    ).getDate();

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="day-cell prev-month">
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        viewDate.getMonth() === today.getMonth() &&
        viewDate.getFullYear() === today.getFullYear();

      const isSelected =
        day === selectedDate.getDate() &&
        viewDate.getMonth() === selectedDate.getMonth() &&
        viewDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`day-cell ${isToday ? "today" : ""} ${
            isSelected ? "selected" : ""
          }`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }

    // Next month filler cells
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="day-cell next-month">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <span className="month-year">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <div className="nav-buttons">
          <button
            onClick={prevMonth}
            className="nav-btn"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="nav-btn"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`header-${i}`} className="day-header">
            {d}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default MiniCalendar;