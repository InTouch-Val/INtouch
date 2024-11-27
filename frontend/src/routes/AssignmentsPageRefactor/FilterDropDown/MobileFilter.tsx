import React from "react";
import "./filter.scss";
import closeMini from "../../../images/icons/closeMini.svg";
import iconFilter from "../../../images/assignment-page/fine-tune.svg";
import iconSort from "../../../images/assignment-page/sort.svg";
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
  handleSortMethodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const options = [
  {
    value: TypeOrder.AddDate,
    label: "Oldest First",
    icon: "path/to/icon1.png",
  },
  {
    value: TypeOrder.DecDate,
    label: "Newest First",
    icon: "path/to/icon2.png",
  },
  {
    value: TypeOrder.NoPopularity,
    label: "Most Shared",
    icon: "path/to/icon3.png",
  },
  {
    value: TypeOrder.NoAverageGrade,
    label: "Top Client Rated",
    icon: "path/to/icon4.png",
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
  const [selectedValueOrder, setSelectedValueOrder] = React.useState(
    TypeOrder.All
  );

  const handleSelectChangeFilter = (value) => {
    setSelectedValueOrder(value);
    setOpenSelect(false);
  };

  const handleOverlayClick = () => {
    if (openSelect) {
      setOpenSelect(false);
      console.log("click", openSelect);
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
      {openSelect && (
        <div className="overlayFilter" onClick={handleOverlayClick} />
      )}
      <div className={"filters-wrapper"}>
        <div className={"filter__sortBox"}>
          <select
            value={sortMethod}
            onChange={(e) => handleSortMethodChange(e)}
          >
            <option value={TypeOrder.AddDate}>Oldest First</option>
            <option value={TypeOrder.DecDate}>Newest First</option>
            <option value={TypeOrder.NoPopularity}>Most Shared</option>
            <option value={TypeOrder.NoAverageGrade}>Top Client Rated</option>
          </select>
        </div>

        <div
          className={"filter__filterBox"}
          onClick={(e) => handleCloseModal(e)}
        >
          {selectedValueOrder != TypeOrder.All ? (
            selectedValueOrder
          ) : (
            <img src={iconFilter} alt="iconFilter" className={"filter__icon"} />
          )}
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
