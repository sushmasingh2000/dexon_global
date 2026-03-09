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

const App = () => {
  const user = localStorage.getItem("logindataen");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Layout><Home/></Layout>} /> */}
        <Route path="/" element={<Main />} />
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

        {user ? (
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
          <Route path="*" element={<Main />} />
        )}
        {/* Protected Routes */}
        {user ? (
          routes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))
        ) : (
          <Route path="*" element={<Main />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;