import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MainDashboard from "./Components/Main-DashBoard-Content";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default home route */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard route */}
        <Route path="/user_dashboard" element={<MainDashboard />} />
      </Routes>
    </Router>
  );
}
