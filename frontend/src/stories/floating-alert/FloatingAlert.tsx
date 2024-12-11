import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

type Props = {
  label: ReactNode;
  visible: boolean;
};

const FloatingAlert = ({ label, visible }: Props) => {
  return (
    <div
      className={`${styles.floating_alert} ${!visible ? styles.floating_alert_hidden : ""}`}
    >
      <span>{label}</span>
    </div>
  );
};

export default FloatingAlert;
