import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, children, confirmText }) => {
    if (!isOpen) return null;
  
    return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal' onClick={e => e.stopPropagation()}>
          <div className='modal-content'
            style={{display: 'flex', flexDirection: 'column',
                    alignItems: 'center'}}
          >
            {children}
            <div className='modal-actions'>
              <button className='action-button' onClick={onClose}>Cancel</button>
              <button className='action-button' onClick={onConfirm}>{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;