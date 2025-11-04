import { useState } from "react";
import {
  MdEdit,
  MdDelete,
  MdEmail,
  MdMoreVert,
  MdClose,
  MdAccessTime,
  MdNotifications,
  MdVideocam,
} from "react-icons/md";
import EventCard from "../../ui/Modal/EventCard";
import "./EventPopup.scss";
import { useEvent } from "../../../context/EventContext";

const EventPopup = ({ event, onClose }) => {
  const [showEventCard, setShowEventCard] = useState(false);
  const { deleteEvent, updateEvent } = useEvent();

  const handleEditClick = () => {
    setShowEventCard(true);
  };

  const handleDeleteClick = async () => {
    if (!event?._id && !event?.id) return;
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const id = event._id || event.id;
      await deleteEvent(id);
      console.log("Event deleted successfully:", id);
      onClose();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.message || "Failed to delete event");
    }
  };

  const handleEventCardClose = () => {
    setShowEventCard(false);
    onClose();
  };

  const handleSave = async (updatedData) => {
    await updateEvent(updatedData);
    setShowEventCard(false);
    onClose();
  };

  const formatEventData = (event) => {
    const start = event.startTime ? new Date(event.startTime) : new Date();
    const end = event.endTime
      ? new Date(event.endTime)
      : new Date(start.getTime() + 60 * 60 * 1000);

    const formattedDate = start.toISOString().split("T")[0];
    const formattedStart = start.toTimeString().slice(0, 5);
    const formattedEnd = end.toTimeString().slice(0, 5);

    return {
      id: event._id || event.id,
      title: event.title || "",
      date: formattedDate,
      startTime: formattedStart,
      endTime: formattedEnd,
      description: event.description || "",
      location: event.location || "",
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {!showEventCard && (
        <div className="event-popup-overlay" onClick={onClose}>
          <div className="event-popup" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="event-popup-header">
              <div className="header-icons">
                <button
                  className="icon-btn"
                  onClick={handleEditClick}
                  title="Edit"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  className="icon-btn"
                  onClick={handleDeleteClick}
                  title="Delete"
                >
                  <MdDelete size={20} />
                </button>
                <button className="icon-btn" title="Email guests">
                  <MdEmail size={20} />
                </button>
                <button className="icon-btn" title="More options">
                  <MdMoreVert size={20} />
                </button>
              </div>
              <button onClick={onClose} className="close-btn">
                <MdClose size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="event-popup-body">
              <div className="event-title-section">
                <div className="event-color-indicator"></div>
                <h2 className="event-title">{event.title}</h2>
              </div>

              <div className="event-detail-row">
                <MdAccessTime size={20} className="detail-icon" />
                <div className="detail-text">
                  <div>{formatDate(event.date || event.startTime)}</div>
                </div>
              </div>

              <div className="event-detail-row">
                <MdNotifications size={20} className="detail-icon" />
                <div className="detail-text">The day before at 5pm</div>
              </div>

              {event.location && (
                <div className="event-detail-row">
                  <MdVideocam size={20} className="detail-icon" />
                  <div className="detail-text">{event.location}</div>
                </div>
              )}

              {event.description && (
                <div className="event-description">{event.description}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEventCard && (
        <EventCard
          isOpen={showEventCard}
          onClose={handleEventCardClose}
          initialData={formatEventData(event)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default EventPopup;