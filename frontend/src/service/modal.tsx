//@ts-nocheck

function Modal({
  isOpen,
  onClose,
  onConfirm,
  children,
  confirmText,
  ifError,
  errorText,
  showCancel = "true",
}) {
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
            <button
              className="action-button"
              onClick={onConfirm}
              disabled={ifError}
            >
              {confirmText}
            </button>
          </div>
          {ifError && (
            <p
              style={{
                color: "red",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {errorText.message || errorText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { Modal };
