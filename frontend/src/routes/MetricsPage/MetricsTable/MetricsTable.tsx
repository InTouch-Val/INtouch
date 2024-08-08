import React from "react";
import "./table.css";
import { Metrics } from "../metrics-page";

interface Props {
  metrics: any;
  variant: Metrics;
}

export default function MetricsTable({ metrics, variant }: Props) {
  const columnTable = React.useMemo(() => {
    if (variant == Metrics.growth) {
      return metrics ? Object.keys(metrics) : [];
    } else {
      return metrics.length > 0 ? Object.keys(metrics[0]) : [];
    }
  }, [metrics]);

  if (variant != Metrics.growth)
    return (
      <>
        <div className="table">
          <div className="table__row-columnName">
            {columnTable.map((item, index) => (
              <div key={index} className="table__cell">
                {item}
              </div>
            ))}
          </div>
          {metrics.map((metric, rowIndex) => (
            <div key={rowIndex} className="table__row">
              {columnTable.map((column, colIndex) => (
                <div key={colIndex} className="table__cell">
                  {metric[column]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    );

  if (variant == Metrics.growth) {
    return (
      <div className="table">
        <div className="table__row-columnNameGrowth">
          {columnTable.map((item, index) => (
            <div key={index} className="table__cellGrowth">
              {item}
            </div>
          ))}
        </div>

        <div className="table__row">
          {columnTable.map((column, colIndex) => (
            <div key={colIndex} className="table__cell">
              {metrics[column]}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
