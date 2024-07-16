import React, { ReactNode } from "react";
import Button from "../stories/buttons/Button";

interface ErrorText {
  message: string;
}

interface PropsModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
  confirmText: string;
  ifError: boolean;
  errorText: ErrorText | string;
  showCancel: boolean;
}

function Modal({
  isOpen,
  onClose,
  onConfirm,
  children,
  confirmText,
  ifError,
  errorText,
  showCancel = true,
}: PropsModal): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="modal-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {children}
          <div className="modal-actions">
            {showCancel && (
              <button className="action-button" onClick={onClose}>
                Cancel
              </button>
            )}

            <Button
              buttonSize="large"
              fontSize="medium"
              label={confirmText}
              type="button"
              onClick={onConfirm}
            />
          </div>
          {ifError && (
            <p
              style={{
                color: "red",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {typeof errorText === "object" ? errorText.message : errorText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { Modal };
