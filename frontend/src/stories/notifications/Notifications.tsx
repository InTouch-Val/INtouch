import React from "react";

interface Props {
  messageText: string;
  status: "success" | "error";
}

export default function Notifications({ messageText, status }: Props) {
  return (
    <div
      className={`${status == "success" ? "success-message" : "error-message"}`}
    >
      {messageText}
    </div>
  );
}
