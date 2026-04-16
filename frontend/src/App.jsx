import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BookAppointment from "./pages/BookAppointment";

const PrivateRoute = ({ children, allowedRole }) => {
  const { isAuth, role } = useAuth();
  if (!isAuth) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { isAuth, role } = useAuth();
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* ✅ Logic Fix: Redirect based on role if already authenticated */}
        <Route path="/login" element={
          isAuth ? <Navigate to={role === "doctor" ? "/doctor" : "/patient"} /> : <Login />
        } />
        
        <Route path="/register" element={
          isAuth ? <Navigate to={role === "doctor" ? "/doctor" : "/patient"} /> : <Register />
        } />

        <Route path="/patient" element={<PrivateRoute allowedRole="patient"><PatientDashboard /></PrivateRoute>} />
        <Route path="/doctor"  element={<PrivateRoute allowedRole="doctor"><DoctorDashboard /></PrivateRoute>} />
        <Route path="/book/:doctorId" element={<PrivateRoute allowedRole="patient"><BookAppointment /></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}