import React from "react";
import styles from "./style.module.scss";

interface Props {
  active: boolean;
  handleClick: () => void;
  label: string;
}

export default function Tumbler({ active, handleClick, label }: Props) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <label className={styles.card__inputLabel}>
        {label}
        <input
          type="checkbox"
          className={styles.card__inputCheckbox}
          defaultChecked={active}
          onClick={handleClick}
        />
      </label>
    </div>
  );
}
