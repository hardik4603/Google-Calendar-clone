import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  MdMenu,
  MdAccessTime,
  MdPeople,
  MdLocationOn,
  MdDescription,
  MdCalendarToday,
} from "react-icons/md";
import { SiGooglemeet } from "react-icons/si";
import "./EventCard.scss";
import { useAuth } from "../../../context/AuthContext";
import { useEvent } from "../../../context/EventContext";

const EventCard = ({ isOpen, onClose, initialData }) => {
  const { user } = useAuth();
  const { addEvent, updateEvent, selectedDate, setSelectedDate } = useEvent();

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    title: initialData?.title || "",
    date: initialData?.date || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    description: initialData?.description || "",
  });

  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: initialData?.id || null,
        title: initialData?.title || "",
        date: initialData?.date || selectedDate.toISOString().split("T")[0],
        startTime: initialData?.startTime || "",
        endTime: initialData?.endTime || "",
        description: initialData?.description || "",
      });
      setError(null);
    }
  }, [isOpen, initialData, selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSaving(true);

    if (!formData.title) {
      setError("Title is required");
      setIsSaving(false);
      return;
    }

    try {
      const { id, date, startTime, endTime, title, description } = formData;

      const startDateTime =
        date && startTime ? new Date(`${date}T${startTime}:00`) : null;
      const endDateTime =
        date && endTime ? new Date(`${date}T${endTime}:00`) : null;

      const payload = {
        title,
        description,
        startTime: startDateTime ? startDateTime.toISOString() : null,
        endTime: endDateTime ? endDateTime.toISOString() : null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      if (id) {
        await updateEvent({ _id: id, ...payload });
      } else {
        await addEvent(payload);
      }

      if (date) {
        setSelectedDate(new Date(date));
      }

      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header">
          <button className="menu-btn">
            <MdMenu size={24} />
          </button>
          <button className="close-btn" onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className="event-title-section">
          <input
            type="text"
            name="title"
            className="event-title-input"
            placeholder="Add title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="event-tabs">
          <button className="tab-btn active">Event</button>
          <button className="tab-btn">Task</button>
          <button className="tab-btn">Appointment schedule</button>
        </div>

        <div className="event-details">
          <div className="detail-row">
            <MdAccessTime size={24} className="detail-icon" />
            <div className="detail-content">
              <div className="date-time-row">
                <input
                  type="date"
                  name="date"
                  className="date-input"
                  value={formData.date}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="startTime"
                  className="time-input"
                  value={formData.startTime}
                  onChange={handleChange}
                />
                <span className="time-separator">–</span>
                <input
                  type="time"
                  name="endTime"
                  className="time-input"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
              <div className="detail-subtext">Time zone • Does not repeat</div>
            </div>
          </div>

          <div className="detail-row">
            <MdPeople size={24} className="detail-icon" />
            <span className="detail-text">Add guests</span>
          </div>

          <div className="detail-row google-meet-row">
            <SiGooglemeet size={24} className="detail-icon google-meet-icon" />
            <span className="detail-text">
              Add Google Meet video conferencing
            </span>
          </div>

          <div className="detail-row">
            <MdLocationOn size={24} className="detail-icon" />
            <span className="detail-text">Add location</span>
          </div>

          <div className="detail-row">
            <MdDescription size={24} className="detail-icon" />
            <textarea
              name="description"
              className="description-input"
              placeholder="Add description or a Google Drive attachment"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="detail-row">
            <MdCalendarToday size={24} className="detail-icon" />
            <div className="detail-content">
              <div className="calendar-info">
                <span className="calendar-name">
                  {user?.name || "My Calendar"}
                </span>
                <span className="calendar-badge"></span>
              </div>
              <div className="detail-subtext">
                Busy • Default visibility • Notify 30 minutes before
              </div>
            </div>
          </div>
        </div>

        <div className="event-modal-footer">
          {error && <div className="event-modal-error">{error}</div>}
          <button className="more-options-btn">More options</button>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : formData.id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;