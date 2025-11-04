import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import EventCard from "../../ui/Modal/EventCard";

const CreateButton = ({ handleOpenModal }) => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialData = getInitialFormData();
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <button className="create-btn" onClick={() => setIsModalOpen(true)}>
        <FaPlus size={20} />
        <span>Create</span>
        <IoChevronDown size={16} className="dropdown-icon" />
      </button>
      <EventCard
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialData={initialData}
      />
    </>
  );
};

export default CreateButton;