import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderSplash from "../layouts/LoaderSplash";
import SearchSchools from "./SearchSchools";
import { Analytics } from "@vercel/analytics/react";
import SchoolInviteForm from "./SchoolInviteForm";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [isLoading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const schoolMail = location.state?.schoolMail || '';

  useEffect(() => {
    if (!schoolMail) {
      navigate('/unauthorized');
    }
  }, [schoolMail, navigate]);

  return (
    <main>
      <Analytics />
      {isLoading && <LoaderSplash show={isLoading} />}
      <div className="registration-container">
        <div className="form-container">
          <h1>Registration Form</h1>
          <div className="form-wrapper">
            <SchoolInviteForm setLoading={setLoading} schoolmail={schoolMail} />
          </div>
        </div>
        <div className="search-container">
          <SearchSchools />
        </div>
      </div>
    </main>
  );
};

export default RegistrationForm;
