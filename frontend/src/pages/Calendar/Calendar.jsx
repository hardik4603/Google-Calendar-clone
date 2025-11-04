import React, { useState } from "react";
import "./Calendar.scss";
import CalendarHeader from "../../components/calendar/CalendarHeader/CalendarHeader";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import MonthView from "../../components/calendar/MonthView/MonthView";
import DayView from "../../components/calendar/DayView/DayView";
import WeekView from "../../components/calendar/WeekView/WeekView";

const Calendar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentCalendarView, setCurrentCalendarView] = useState("month");

  const calendarMap = {
    month: <MonthView />,
    week: <WeekView />,
    day: <DayView />,
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div
      className={`calendar-page ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <CalendarHeader
        onToggleSidebar={toggleSidebar}
        setCurrentCalendarView={setCurrentCalendarView}
        currentCalendarView={currentCalendarView}
      />

      <div className="calendar-layout">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className="calendar-main">
          {calendarMap[currentCalendarView]}
        </main>
      </div>
    </div>
  );
};

export default Calendar;