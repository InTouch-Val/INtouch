import ReactDOM from 'react-dom';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import ModalStyles from '../Modal/Modal.module.css';

const Modal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root');

  return ReactDOM.createPortal(
    <>
      <ModalOverlay />
      <div className={ModalStyles.modal_container} id="modal">
        {children}
      </div>
    </>,
    modalRoot,
  );
};

export default Modal;
