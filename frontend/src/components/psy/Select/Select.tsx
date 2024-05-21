//@ts-nocheck
import React from "react";
import "./Select.css";

export default function Select({ menu, setActivityFilter }) {
  return (
    <div className="select">
      {menu.map((i) => {
        return (
          <button
            className="select__option"
            key={i.id}
            onClick={() => {
              setActivityFilter(i);
            }}
          >
            <div className="select__text">{i.text}</div>
          </button>
        );
      })}
    </div>
  );
}
