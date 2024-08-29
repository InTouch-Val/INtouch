import React from "react";
import "./style.module.css";

interface Props {
  active: boolean;
  handleClick: () => void;
  label: string;
}

export default function Tumbler({ active, handleClick, label }: Props) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <label className="card__input-label">
        {label}
        <input
          type="checkbox"
          className="card__input-checkbox"
          defaultChecked={active}
          onClick={handleClick}
        />
      </label>
    </div>
  );
}
