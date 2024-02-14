import './ButtonHeadline'
import PropTypes from 'prop-types';

export default function Button({ children, className, onClick }) {
function handleClick() {
    if (onClick){
        onClick();
    }
}

    return (
    <button className={`button ${className}`} onClick={handleClick}>{ children }</button>
    );
} 
Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
};