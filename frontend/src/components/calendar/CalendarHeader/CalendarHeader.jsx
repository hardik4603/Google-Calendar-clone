import React, { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaRegQuestionCircle,
  FaCog,
  FaCalendarAlt,
  FaCheck,
  FaTh,
} from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import "./CalendarHeader.scss";
import { useAuth } from "../../../context/AuthContext";
import { useEvent } from "../../../context/EventContext";

const CalendarHeader = ({
  onToggleSidebar,
  currentCalendarView,
  setCurrentCalendarView,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useEvent();

  const currentMonthYear = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const options = [
    { label: "Day", value: "day", shortcut: "D" },
    { label: "Week", value: "week", shortcut: "W" },
    { label: "Month", value: "month", shortcut: "M" },
    { label: "Year", value: "year", shortcut: "Y" },
  ];

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const handleNavigation = (direction) => {
    const newDate = new Date(selectedDate);

    if (currentCalendarView === "day") {
      newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (currentCalendarView === "week") {
      newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (currentCalendarView === "month") {
      newDate.setMonth(
        selectedDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    } else if (currentCalendarView === "year") {
      newDate.setFullYear(
        selectedDate.getFullYear() + (direction === "next" ? 1 : -1)
      );
    }

    setSelectedDate(newDate);
  };

  return (
    <header className="calendar-header">
      <div className="left-section">
        <FaBars onClick={onToggleSidebar} className="icon hamburger-icon" />
        <div className="logo">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png"
            alt="Google Calendar"
          />
          <span className="title">Calendar</span>
        </div>

        <button className="today-btn" onClick={handleTodayClick}>
          Today
        </button>

        <div className="nav-arrows">
          <span className="arrow" onClick={() => handleNavigation("prev")}>
            ‹
          </span>
          <span className="arrow" onClick={() => handleNavigation("next")}>
            ›
          </span>
        </div>

        <span className="date">{currentMonthYear}</span>
      </div>

      <div className="right-section">
        <FaSearch className="icon" />
        <FaRegQuestionCircle className="icon" />
        <FaCog className="icon" />

        <div className="view-selector">
          <button
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {options.find((o) => o.value === currentCalendarView)?.label ||
              "View"}
            <MdOutlineArrowDropDown />
          </button>

          {isDropdownOpen && (
            <div className="custom-dropdown">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  className={`dropdown-item ${
                    currentCalendarView === opt.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setCurrentCalendarView(opt.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span>{opt.label}</span>
                  <span className="shortcut">{opt.shortcut}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="view-buttons">
          <button
            className={currentCalendarView === "month" ? "active" : ""}
            onClick={() => setCurrentCalendarView("month")}
          >
            <FaCalendarAlt />
          </button>
          <button
            className={currentCalendarView === "week" ? "active" : ""}
            onClick={() => setCurrentCalendarView("week")}
          >
            <FaCheck />
          </button>
          <button
            className={currentCalendarView === "day" ? "active" : ""}
            onClick={() => setCurrentCalendarView("day")}
          >
            <FaTh />
          </button>
        </div>

        <div className="profile">{user?.name?.[0]?.toUpperCase()}</div>
      </div>
    </header>
  );
};

export default CalendarHeader;