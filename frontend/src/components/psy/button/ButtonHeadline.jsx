import './ButtonHeadline.css';
import PropTypes from 'prop-types';

export default function Button({
  children,
  className,
  onClick,
  type = 'button',
  disabled = false,
}) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <button type={type} className={`browse ${className}`} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
}
Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
