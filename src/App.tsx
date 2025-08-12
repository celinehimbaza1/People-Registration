import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Ensure AuthProvider wraps your routes

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import RegisteredListPage from "./pages/RegisteredList";
import RegistrationSuccess from "./pages/RegistrationSuccess";
// We no longer need the Landing page as the default, but we'll keep the import in case you want to use it elsewhere.
import Landing from "./pages/Landing"; 

function App() {
  return (
    // Wrap everything in AuthProvider so all components know if a user is logged in
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- THIS IS THE CORRECTED PART --- */}
          {/* The default path "/" now directs to the Login page. */}
          <Route path="/" element={<Login />} />

          {/* --- Public Routes --- */}
          {/* We keep the explicit /login route as well for clarity */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- Protected Routes (These are unchanged) --- */}
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
    </AuthProvider>
  );
}

export default App;