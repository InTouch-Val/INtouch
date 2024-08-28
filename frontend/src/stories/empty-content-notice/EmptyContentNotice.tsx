import React, { ReactNode } from "react";
import "./empty-content-notice.css";

type Props = {
  label: ReactNode;
};

const EmptyContentNotice = ({ label }: Props) => {
  return <div className="empty-content-notice">{label}</div>;
};

export default EmptyContentNotice;
