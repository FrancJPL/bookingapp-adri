import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import "./styles/theme.css";

import Home from "./pages/Home";
import SectorSelection from "./pages/SectorSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import LocationSelection from "./pages/LocationSelection";
import MyReservations from "./pages/MyReservations";
import AdminDashboard from "./pages/AdminDashboard";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./components/ProtectedRoute";


function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("hairdresser")) {
      document.body.setAttribute("data-sector", "peluqueria");
    } else if (path.includes("padel")) {
      document.body.setAttribute("data-sector", "padel");
    } else {
      document.body.removeAttribute("data-sector");
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SectorSelection />} />
        <Route path="/hairdresser" element={<Home sector="peluqueria" />} />
        <Route path="/padel" element={<Home sector="padel" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/locations" element={<LocationSelection />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute allowedRoles={[3, 2]}>
              <Calendar />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

