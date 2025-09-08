import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import MainDashboard from "./Components/Main-DashBoard-Content";
import AdminPanel from "./Components/AdminPanel";
import CourseCreation from "./Components/CourseCreation";
import LessonViewer from "./Components/LessonViewer";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user_dashboard" element={<MainDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/courses" element={<CourseCreation />} />
          <Route path="/lesson/:lessonId" element={<LessonViewer />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
