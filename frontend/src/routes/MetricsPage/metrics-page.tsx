import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import Button from "../../components/psy/button/ButtonHeadline";
import { API } from "../../service/axios";
import MetricsTable from "./MetricsTable/MetricsTable";
import { useAuth } from "../../service/authContext";
import { redirect, useNavigate } from "react-router-dom";

export enum Metrics {
  psy = "therapists",
  client = "clients",
  growth = "growth",
  default = "default",
}

interface FormattedDate {
  dateTo: string | null;
  dateFrom: string | null;
}

const AUTH_EMAIL = "v.y.maklakova@gmail.com";

export const metricsPageLoader = async () => {
  try {
    const response = await API.get("get-user/");
    let currentUser = response.data[0];

    if (currentUser?.email !== AUTH_EMAIL) {
      return redirect("/");
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export function MetricsPage() {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [selectMetric, setSelectMetric] = React.useState(Metrics.default);

  const [formattedDate, setFormattedDate] = React.useState<FormattedDate>({
    dateTo: null,
    dateFrom: null,
  });

  const [metrics, setMetrics] = React.useState<any>();

  const handleChangeDateBegin = (date) => {
    const formattedDate = formatDate(date);
    setStartDate(date);
    setMetrics("");

    setFormattedDate((prev) => ({
      ...prev,
      dateFrom: formattedDate,
    }));
  };

  const handleChangeDateEnd = (date) => {
    const formattedDate = formatDate(date);
    setEndDate(date);
    setMetrics("");

    setFormattedDate((prev) => ({
      ...prev,
      dateTo: formattedDate,
    }));
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  function handleSelectMetric(typeMetrics: Metrics) {
    setSelectMetric(typeMetrics);
    setMetrics("");
  }

  async function getMetrics() {
    const response = await API.get(
      `project-metrics/${selectMetric}/?date_from=${formattedDate.dateFrom}&date_to=${formattedDate.dateTo}`
    );

    setMetrics(response.data);
  }

  async function getMetricsExcel() {
    try {
      const response = await API.get(
        `project-metrics/${selectMetric}/download?date_from=${formattedDate.dateFrom}&date_to=${formattedDate.dateTo}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "metrics.csv");

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="metrics">
      <div className="metrics__title"> Метрики</div>

      <div className="metrics__content">
        <div className="metrics__contentHeader"> Выберите период</div>

        <div className="metrics__wrapperInputs">
          <div className="metrics__beginInput">
            <div className="metrics__text">Период с </div>
            <DatePicker selected={startDate} onChange={handleChangeDateBegin} />
          </div>

          <div className="metrics__endInput">
            <div className="metrics__text">по </div>
            <DatePicker selected={endDate} onChange={handleChangeDateEnd} />
          </div>
        </div>

        <div className="metrics__typeMetrics">Type metrics: {selectMetric}</div>

        <div className="metrics__wrapperButtons">
          <Button
            onClick={() => handleSelectMetric(Metrics.psy)}
            className="metrics__button"
          >
            Аналитика психологии{" "}
          </Button>
          <Button
            onClick={() => handleSelectMetric(Metrics.growth)}
            className="metrics__button"
          >
            Метрики роста{" "}
          </Button>
          <Button
            onClick={() => handleSelectMetric(Metrics.client)}
            className="metrics__button"
          >
            Аналитика клиентов{" "}
          </Button>
        </div>

        <div className="metrics__wrapperButtons">
          <Button
            onClick={() => getMetrics()}
            className="metrics__button"
            disabled={
              selectMetric == Metrics.default ||
              !formattedDate.dateFrom ||
              !formattedDate.dateTo
            }
          >
            Сгенерировать
          </Button>
          <Button
            onClick={() => getMetricsExcel()}
            className="metrics__button"
            disabled={
              selectMetric == Metrics.default ||
              !formattedDate.dateFrom ||
              !formattedDate.dateTo
            }
          >
            Скачать
          </Button>
        </div>
      </div>

      <div className="metrics__table">
        {metrics && selectMetric != Metrics.growth && (
          <MetricsTable metrics={metrics} variant={Metrics.client} />
        )}
      </div>

      <div className="metrics__table">
        {metrics && selectMetric == Metrics.growth && (
          <MetricsTable metrics={metrics} variant={Metrics.growth} />
        )}
      </div>
    </div>
  );
}
