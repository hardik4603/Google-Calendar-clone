import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import { useAuth } from "./context/AuthContext";
import Calendar from "./pages/Calendar/Calendar";
import { EventProvider } from "./context/EventContext";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <EventProvider>
        <Routes>
          <Route
            path="/calendar"
            element={user ? <Calendar /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/calendar" replace />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/calendar" : "/auth"} replace />}
          />
        </Routes>
      </EventProvider>
    </Router>
  );
};

export default App;