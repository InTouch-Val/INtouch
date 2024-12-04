import React from "react";
import styles from "./modal.module.scss";
import iconClose from "../../../images/icons/close.svg";
import { TypeFilter, TypeIssue, TypeLanguage } from "../../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  changeFilterTypeActions,
  changeIssueActions,
  changeLanguageActions,
} from "../../../store/slices";
import Button from "../../../stories/buttons/Button";

interface Props {
  handleCloseModal: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function ModalFilterMobile({ handleCloseModal }: Props) {
  const dispatch = useAppDispatch();

  const { activeLanguage, activeFilterType, activeOrder, activeIssue } =
    useAppSelector((state) => state.assignment);

  return (
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modal__iconWrapper}>
        {" "}
        <img
          alt="close"
          src={iconClose}
          className={styles.modal__close}
          onClick={handleCloseModal}
        />{" "}
      </div>

      <h2 className={styles.modal__title}>Filters</h2>

      <div className={styles.modal__typeFilterContent}>
        <h3 className={styles.modal__typeFilterSubtitle}>Types</h3>
        <div className={styles.modal__filterList}>
          {Object.entries(TypeFilter).map(([key, value]) => (
            <div
              key={value}
              className={
                activeFilterType == value
                  ? `${styles.modal__chip_selected} ${styles.modal__chip}`
                  : `${styles.modal__chip}`
              }
              onClick={() => dispatch(changeFilterTypeActions(value))}
            >
              {key}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.modal__typeFilterContent}>
        <h3 className={styles.modal__typeFilterSubtitle}>Languages</h3>
        <div className={styles.modal__filterList}>
          {Object.entries(TypeLanguage).map(([key, value]) => (
            <div
              key={value}
              className={
                activeLanguage == value
                  ? `${styles.modal__chip_selected} ${styles.modal__chip}`
                  : `${styles.modal__chip}`
              }
              onClick={() => dispatch(changeLanguageActions(value))}
            >
              {key}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.modal__typeFilterContent}>
        <h3 className={styles.modal__typeFilterSubtitle}>Issue</h3>
        <div className={styles.modal__filterList}>
          {Object.entries(TypeIssue).map(([key, value]) => (
            <div
              key={value}
              className={
                activeIssue == value
                  ? `${styles.modal__chip_selected} ${styles.modal__chip}`
                  : `${styles.modal__chip}`
              }
              onClick={() => dispatch(changeIssueActions(value))}
            >
              {key}
            </div>
          ))}
        </div>
      </div>

      <div
        className={styles.modal__wrapperButton}
        onClick={(e) => handleCloseModal(e)}
      >
        <Button type="button" label="View Items" />
      </div>
    </div>
  );
}
