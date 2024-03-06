import './ButtonHeadline.css';
import PropTypes from 'prop-types';

export default function Button({ children, className, onClick, type = 'button' }) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <button type={type} className={`browse ${className}`} onClick={handleClick}>
      {children}
    </button>
  );
}
Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
