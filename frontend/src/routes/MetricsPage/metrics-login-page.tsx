import React from "react";
import { useState } from "react";
import { API } from "../../service/axios";
import { useNavigate } from "react-router-dom";
import Button from "../../stories/buttons/Button";
import "./style.css";

export default function MetricsLoginPage() {
  const [metricsCredentials, setMetricsCredentials] = useState({
    password: "",
  });
  const navigate = useNavigate();

  const handleMetricsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const requestData = {
        password: metricsCredentials.password.trim(),
      };

      const response = await API.post("metrics-login/", requestData);
      localStorage.setItem("isMetricsLoggedIn", "true");

      if (response.status === 200) {
        navigate("/metrics");
      }
    } catch (error) {
      let message: string;
    }
  };

  return (
    <div className="metrics">
      <div className="metrics__title"> Метрики</div>
      <form
        onSubmit={handleMetricsLogin}
        className="metrics__login-form"
        autoComplete="off"
      >
        <input
          type="password"
          id="metrics-password"
          name="metrics-password"
          placeholder="Password"
          onChange={(e) => setMetricsCredentials({ password: e.target.value })}
          autoComplete="new-password"
        />
        <Button
          buttonSize="small"
          fontSize="small"
          label="Войти"
          type="submit"
        />
      </form>
    </div>
  );
}
