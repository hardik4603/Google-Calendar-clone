import { useState } from "react";
import "./CalendarGrid.scss";
import EventCard from "../../ui/Modal/EventCard";
import EventPopup from "../../events/EventDetails/EventPopup";

const CalendarGrid = ({
  date,
  isCurrentMonth,
  isToday,
  events = [],
  index,
  onDeleteEvent,
  onUpdateEvent,
}) => {
  const getInitialFormData = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const defaultDate = `${year}-${month}-${day}`;

    const startHour = now.getHours().toString().padStart(2, "0");
    const startMinute = now.getMinutes().toString().padStart(2, "0");
    const defaultStart = `${startHour}:${startMinute}`;

    const end = new Date(now.getTime() + 60 * 60 * 1000);
    const endHour = end.getHours().toString().padStart(2, "0");
    const endMinute = end.getMinutes().toString().padStart(2, "0");
    const defaultEnd = `${endHour}:${endMinute}`;

    return {
      date: defaultDate,
      startTime: defaultStart,
      endTime: defaultEnd,
    };
  };

  const [isAllEventModal, setIsAllEventModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const initialData = getInitialFormData();
  initialData.date = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const handleModalClose = () => setIsModalOpen(false);
  const handlePopupClose = () => setSelectedEvent(null);

  const dayNumber = date.getDate();
  const visibleEvents = events.slice(0, 2);
  const remainingCount = events.length - 3;

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const handleMore = (e) => {
    e.stopPropagation();
    setIsAllEventModal(true);
  };

  return (
    <>
      <div
        className={`calendar-grid-cell ${
          !isCurrentMonth ? "other-month" : ""
        } ${isToday ? "today" : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        {index < 7 && <div className="weekday-name">{dayNames[index]}</div>}
        <div className="date-number">
          <span className={isToday ? "today-badge" : ""}>{dayNumber}</span>
        </div>

        <div className="events-container">
          {visibleEvents.map((event, i) => (
            <div
              key={event.id || i}
              className="event-item"
              onClick={(e) => handleEventClick(e, event)}
            >
              {event.time && <span className="event-time">{event.time}</span>}
              <div className="event-title">{event.title}</div>
            </div>
          ))}

          {remainingCount > 0 && (
            <div className="more-events" onClick={handleMore}>
              {remainingCount} more
            </div>
          )}
        </div>
      </div>

      {!selectedEvent && (
        <EventCard
          isOpen={isModalOpen}
          onClose={handleModalClose}
          initialData={initialData}
        />
      )}

      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          onClose={handlePopupClose}
          onDelete={onDeleteEvent}
          onUpdate={onUpdateEvent}
        />
      )}
    </>
  );
};

export default CalendarGrid;