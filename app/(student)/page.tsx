"use client";

import React, { useEffect, useState } from "react";
import Homepage from "./homepage/page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SurveyForm from "./survey/page";

const StudentPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setHasPreferences(auth.user.hasPreferences);
    }
  }, [auth.user]);

  return <>{hasPreferences ? <Homepage /> : <SurveyForm />}</>;
};

export default StudentPage;
