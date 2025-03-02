import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./my_components/ThemeProvider";
import AdPage from "./pages/AdPage";
import TestPage from "./pages/TestPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<TestPage />} />
          {/* <Route path="/upload" element={<UploadComponent />}/> */}
        </Routes>
      </Router>
      <Toaster position="top-right"></Toaster>
    </ThemeProvider>
  );
};

export default App;
