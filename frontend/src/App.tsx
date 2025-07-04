import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./my_components/ThemeProvider";
import AdPage from "./pages/AdPage";
import { Toaster } from "react-hot-toast";
import UserPage from "./pages/UserPage";
import { KeyboardProvider } from "./my_components/KeyboardContext";

const App = () => {
  return (
    <KeyboardProvider>
      <ThemeProvider defaultTheme="light">
        <Router>
          <Routes>
            <Route path="/" element={<AdPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<UserPage />} />
          </Routes>
        </Router>
        <Toaster position="bottom-right" reverseOrder={false}></Toaster>
      </ThemeProvider>
    </KeyboardProvider>
  );
};

export default App;
