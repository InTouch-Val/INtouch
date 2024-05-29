import React from "react";

interface ButtonProps {
  primary: boolean;
  label: string;
  backgroundColor?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  primary,
  label,
  backgroundColor,
  size,
  disabled,
}) => {
  const baseStyle = "border rounded font-medium focus:outline-none";
  const primaryStyle = "text-white bg-blue-500 hover:bg-blue-700";
  const secondaryStyle =
    "text-gray-800 bg-transparent border-gray-400 hover:bg-gray-200";

  const sizeStyles = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const style = `
    ${baseStyle}
    ${primary ? primaryStyle : secondaryStyle}
    ${sizeStyles[size || "medium"]}
  `;

  return (
    <button style={{ backgroundColor }} className={style} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
