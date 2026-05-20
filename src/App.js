import "animate.css";
import "aos/dist/aos.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../src/index.css";
import { adminroutes } from "./Adminpages/AdminRoutes";
import LogIn from "./Adminpages/Authentication/Login";
import AdminLayout from "./Adminpages/Layout";
import "./App.css";
import ForgotPassword from "./authentication/Forgotpassword";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import { routes } from "./routes/Routes";
// import Home from "./Welcome";
// import IFCTrade from "./IFCtrade";
import DappLogin from "./authentication/DappLogin";
import DappRegistration from "./authentication/DappRegistration";
import Main from "./Dexon";
import { useEffect } from "react";
import { deCryptData } from "./utils/Secret";

const App = () => {
  const user = deCryptData(localStorage.getItem("logindataen"));
  const admin = localStorage.getItem("logindataen_admin");

  // Block inspect element shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = (e.key || "").toLowerCase();
      const code = e.code || "";

      // F12 (browser shortcut)
      if (key === "f12" || code === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          (key === "i" || key === "j" || key === "c")) ||
        ((e.ctrlKey || e.metaKey) && key === "u")
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
      }

      return true;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return false;
    };

    // Capture phase helps intercept before most other handlers.
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyDown, true);
    document.addEventListener("keypress", handleKeyDown, true);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyDown, true);
    window.addEventListener("keypress", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyDown, true);
      document.removeEventListener("keypress", handleKeyDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyDown, true);
      window.removeEventListener("keypress", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Layout><Home/></Layout>} /> */}
        <Route path="/" element={<Main />} />
        {/* <Route path="/" element={<DappLogin />} /> */}
        <Route path="/login" element={<DappLogin />} />
        {/* <Route path="/login" element={<Login />} />  */}
        <Route path="/register" element={<DappRegistration />} />
        {/* <Route path="/register" element={<Registration />} /> */}
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        {/* //admin */}
        <Route path="/adminlogin" element={<LogIn />} />

        {admin ? (
          adminroutes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              element={
                <AdminLayout
                  id={route.id}
                  navLink={route.path}
                  navItem={route.navItem}
                  component={route.component}
                />
              }
            />
          ))
        ) : (
          <Route path="*" element={<DappLogin />} />
          // <Route path="*" element={<Main />} />
        )}
        {/* Protected Routes */}
        {user ? (
          routes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))
        ) : (
          // <Route path="*" element={<Main />} />
          <Route path="*" element={<DappLogin />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
