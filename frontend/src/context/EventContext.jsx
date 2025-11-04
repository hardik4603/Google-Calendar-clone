import { createContext, useContext, useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import { useAuth } from "./AuthContext";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const {user} = useAuth();
  const request = useApi();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const getEvents = () => request("/events", "GET", null, false, true);
  const addEventApi = (event) => request("/events", "POST", event, false, true);
  const updateEventApi = (event) =>
    request(`/events/${event._id}`, "PUT", event, false, true);
  const deleteEventApi = (id) =>
    request(`/events/${id}`, "DELETE", null, false, true);

  useEffect(() => {
    if (user) {
    const fetchData = async () => {
      const data = await getEvents();
      if (data) setEvents(data);
    };
    fetchData();
  }
  }, [user]);

  const addEvent = async (newEvent) => {
    const saved = await addEventApi(newEvent);
    if (saved) setEvents((prev) => [...prev, saved]);
  };

  const updateEvent = async (updatedEvent) => {
    const saved = await updateEventApi(updatedEvent);
    if (saved)
      setEvents((prev) =>
        prev.map((ev) => (ev._id === saved._id ? saved : ev))
      );
  };

  const deleteEvent = async (id) => {
    const success = await deleteEventApi(id);
    if (success) setEvents((prev) => prev.filter((ev) => ev._id !== id));
  };

  return (
    <EventContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        events,
        setEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);