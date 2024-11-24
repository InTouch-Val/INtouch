import React from "react";
import "./filter.scss";
import iconSort from "../../../images/assignment-page/sort.svg";
import iconFilter from "../../../images/assignment-page/fine-tune.svg";
import { TypeFilter } from "../../../utils/constants";

export default function MobileFilter() {
  const [openSelect, setOpenSelect] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(TypeFilter.All);

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    setOpenSelect(false);
    console.log("click", openSelect);
  };

  const handleOverlayClick = () => {
    if (openSelect) {
      setOpenSelect(false);
      console.log("click", openSelect);
    }
  };

  return (
    <>
      {openSelect && (
        <div className="overlayFilter" onClick={handleOverlayClick} />
      )}
      <div className={"filters-wrapper"}>
        <div className={"filter__sortBox"}>
          <img src={iconSort} alt="iconSort" className={"filter__icon"} />
        </div>
        <div
          className={"filter__filterBox"}
          onClick={() => setOpenSelect((prev) => !prev)}
        >
          {selectedValue != TypeFilter.All ? (
            selectedValue
          ) : (
            <img src={iconFilter} alt="iconFilter" className={"filter__icon"} />
          )}
          {openSelect && (
            <div className="filter__dropdown">
              <ul>
                {Object.entries(TypeFilter).map(([key, value]) => (
                  <li key={value} onClick={() => handleSelectChange(value)}>
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
