import React from "react";
import "./button.css";

type Props = {
  disabled?: boolean;
  fontSize?: "small" | "medium";
  buttonSize?: "small" | "large";
  label: string;
  icon?: string;
  onClick?: () => void;
  type: "button" | "submit";
};

const Button = ({
  disabled = false,
  fontSize = "medium",
  buttonSize = "large",
  label,
  icon = "",
  onClick = () => {},
  type,
}: Props) => {
  return (
    <button
      type={type}
      className={`buttonComponent ${disabled ? "disabled" : ""} ${buttonSize == "large" ? "large" : "small"}  ${fontSize == "small" ? "smallFont" : ""}`}
      onClick={onClick}
    >
      {icon && <img src={icon} alt="icon" className="buttonComponent__icon" />}

      {label}
    </button>
  );
};

export default Button;
