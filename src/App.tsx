import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register"; // ⬅️ People registration form
import RegisteredListPage from "./pages/RegisteredList"; // ⬅️ Export/records page
import RegistrationSuccess from "./pages/RegistrationSuccess"; // ⬅️ Success page

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- Protected Routes --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registered-list"
          element={
            <ProtectedRoute>
              <RegisteredListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registration-success"
          element={
            <ProtectedRoute>
              <RegistrationSuccess />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
