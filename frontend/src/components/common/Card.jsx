function Card({ title, subtitle, onClick, className = '' }) {
  return (
    <button type="button" className={`tech-card ${className}`.trim()} onClick={onClick}>
      <span className="card-title">{title}</span>
      <span className="card-subtitle">{subtitle}</span>
    </button>
  );
}

export default Card;
