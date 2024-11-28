import React from "react";
import "./filter.scss";
import closeMini from "../../../images/icons/closeMini.svg";
import iconFilter from "../../../images/assignment-page/fine-tune.svg";
import iconSort from "../../../images/assignment-page/sort.svg";
import IconOk from "../../../images/icons/iconOk.svg";
import {
  TypeFilter,
  TypeIssue,
  TypeLanguage,
  TypeOrder,
} from "../../../utils/constants";
import Modal from "../../../components/modals/Modal/Modal";
import ModalFilterMobile from "./ModalFilterMobile";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  changeFilterTypeActions,
  changeIssueActions,
  changeLanguageActions,
} from "../../../store/slices";

interface Props {
  sortMethod: TypeOrder;
  handleSortMethodChange: (e: TypeOrder) => void;
}

const options = [
  {
    value: TypeOrder.AddDate,
    label: "Oldest First",
    icon: IconOk,
  },
  {
    value: TypeOrder.DecDate,
    label: "Newest First",
    icon: IconOk,
  },
  {
    value: TypeOrder.NoPopularity,
    label: "Most Shared",
    icon: IconOk,
  },
  {
    value: TypeOrder.NoAverageGrade,
    label: "Top Client Rated",
    icon: IconOk,
  },
];

export default function MobileFilter({
  sortMethod,
  handleSortMethodChange,
}: Props) {
  const dispatch = useAppDispatch();

  const { activeLanguage, activeFilterType, activeOrder, activeIssue } =
    useAppSelector((state) => state.assignment);

  const [openSelect, setOpenSelect] = React.useState(false);
  const [openSelectSort, setOpenSelectSort] = React.useState(false);


  const handleOverlayClick = () => {
    if (openSelect) {
      setOpenSelect(false);
      console.log("click", openSelect);
    }
    if (openSelectSort) {
      setOpenSelectSort(false);
    }
  };


  const handleCloseModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenSelect((prev) => !prev);
  };

  return (
    <>
      {openSelectSort && (
        <div className="overlayFilter" onClick={handleOverlayClick} />
      )}
      <div className={"filters-wrapper"}>
        <div
          className={"filter__sortBox"}
          onClick={(e) => {
            e.stopPropagation();
            setOpenSelectSort(true);
          }}
        >
          {activeOrder != TypeOrder.DecDate ? (
            activeOrder
          ) : (
            <img src={iconSort} alt="iconFilter" className={"filter__icon"} />
          )}
          {openSelectSort && (
            <ul className="filter__dropdown">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={"filter__option"}
                  onClick={() => handleSortMethodChange(option.value)}
                >
                  <div className="filter__optionImageWrapper">
                    {sortMethod === option.value && (
                      <img src={option.icon} alt="" />
                    )}
                  </div>
                  <div className="filter__optionLabel">{option.label} </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={"filter__filterBox"}
          onClick={(e) => handleCloseModal(e)}
        >
          <img src={iconFilter} alt="iconFilter" className={"filter__icon"} />
          {openSelect && (
            <Modal>
              <ModalFilterMobile handleCloseModal={handleCloseModal} />
            </Modal>
          )}
        </div>
      </div>
      <div className={"filter__activeList"}>
        {activeFilterType != TypeFilter.All && (
          <div className={"filter__activeChip"}>
            <div className={"filter__activeChipText"}>{activeFilterType} </div>
            <img
              className={"filter__activeChipClose"}
              alt="close"
              src={closeMini}
              onClick={() => dispatch(changeFilterTypeActions(TypeFilter.All))}
            />
          </div>
        )}

        {activeIssue != TypeIssue.all && (
          <div className={"filter__activeChip"}>
            <div className={"filter__activeChipText"}>{activeIssue} </div>
            <img
              className={"filter__activeChipClose"}
              alt="close"
              src={closeMini}
              onClick={() => dispatch(changeIssueActions(TypeIssue.all))}
            />
          </div>
        )}

        {activeLanguage != TypeLanguage.All && (
          <div className={"filter__activeChip"}>
            <div className={"filter__activeChipText"}>{activeLanguage} </div>
            <img
              className={"filter__activeChipClose"}
              alt="close"
              src={closeMini}
              onClick={() => dispatch(changeLanguageActions(TypeLanguage.All))}
            />
          </div>
        )}
      </div>
    </>
  );
}
