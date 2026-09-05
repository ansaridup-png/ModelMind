function DashboardCard({ title, subtitle, onClick, accent = 'cyan' }) {
  return (
    <button type="button" className={`tech-card accent-${accent}`} onClick={onClick}>
      <span className="card-title">{title}</span>
      <span className="card-subtitle">{subtitle}</span>
    </button>
  );
}

export default DashboardCard;
