import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./Component/NotFoundPage";
import RegistrationForm from "./Component/RegistrationForm";
import Dashboard from "./Component/Dashboard";
import UnauthorizedPage from "./Component/UnauthorizedPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:schoolmail" element={<AuthenticateUser />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

const AuthenticateUser = () => {
  const { schoolmail } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/authenticate/${schoolmail}`
        );

        // Navigate to the dashboard if participants are found
        if (response.data.length > 0) {
          navigate("/dashboard", { state: { schoolMail: schoolmail } });
        } else {
          // Navigate to the registration page if no participants are found
          navigate("/register", { state: { schoolMail: schoolmail } });
        }
      } catch (error) {
        const statusCode = error.response?.status;
        const errMsg = error.response?.data?.message;

        // Handle different error statuses
        switch (statusCode) {
          case 400:
            navigate("/unauthorized", { state: { errMsg: errMsg } });
            break;
          case 404:
            navigate("/notfound", { state: { errMsg: errMsg } });
            break;
          default:
            navigate("/notfound", {
              state: { errMsg: "An unexpected error occurred" },
            });
            break;
        }
      }
    };

    authenticate();
  }, [schoolmail, navigate]);

  return null;
};

export default App;
