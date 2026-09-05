function Button({ children, onClick, variant = 'primary', type = 'button', className = '' }) {
  return (
    <button type={type} className={`common-button ${variant} ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
