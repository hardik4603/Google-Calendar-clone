import { FiPlus, FiUser, FiChevronDown, FiChevronUp } from "react-icons/fi";
import MiniCalendar from "../../calendar/MiniCalendar/MiniCalendar";
import "./Sidebar.scss";
import CreateButton from "../CreateButton/CreateButton";

const Sidebar = ({ sidebarOpen }) => {
  return (
    <>
      <aside className={`calendar-sidebar ${sidebarOpen ? "" : "hide"}`}>
        <CreateButton />
        <MiniCalendar />

        <div className="search-people">
          <FiUser size={20} />
          <span>Search for people</span>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <span>Booking pages</span>
            <FiPlus className="icon" size={18} />
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <span>My calendars</span>
            <FiChevronDown className="icon" size={18} />
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <span>Other calendars</span>
            <FiChevronUp className="icon" size={18} />
          </div>
          <label className="calendar-option">
            <input type="checkbox" defaultChecked />
            <span>Holidays in India</span>
          </label>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;