import { useEffect, useState } from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import SearchBar from '../../components/common/SearchBar';
import MachineLearning from '../ML/MachineLearning';
import DeepLearning from '../DL/DeepLearning';
import { fetchDashboardData } from '../../services/dashboardApi';

function Dashboard() {
  const [showMachineLearning, setShowMachineLearning] = useState(false);
  const [showDeepLearning, setShowDeepLearning] = useState(false);
  const [dashboard, setDashboard] = useState({ title: 'ModelMind', tagline: 'From data to decisions.', cards: [], rag: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (showMachineLearning) {
    return <MachineLearning onBack={() => setShowMachineLearning(false)} />;
  }
  if (showDeepLearning) { 
    return <DeepLearning onBack={() => setShowDeepLearning(false)} />;
  }

  return (
    <div className="dashboard-shell">
      <header className="app-header">
        <div className="brand-mark">
          <span className="brand-dot" />
          <span className="brand-label">ModelMind</span>
        </div>
        <div className="tagline-wrap">
          <h1>{dashboard.title}</h1>
          <p className="tagline">{dashboard.tagline}</p>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Loading dashboard...</div>
      ) : (
        <>
          <div className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">AI platform</span>
              <h2>Build smarter models with faster insight.</h2>
              <p>Explore machine learning workflows, deep learning pipelines, and retrieval-powered AI experiences from one unified workspace.</p>
            </div>
            <div className="hero-stats">
              <div>
                <strong>24/7</strong>
                <span>Model ops</span>
              </div>
              <div>
                <strong>120+</strong>
                <span>Experiments</span>
              </div>
              <div>
                <strong>99.2%</strong>
                <span>Accuracy focus</span>
              </div>
            </div>
          </div>

          <div style={{ margin: '18px 0' }}>
            <SearchBar
              placeholder="Search models, pages or workflows..."
              items={dashboard.cards.map((c) => ({ label: c.title, subtitle: c.subtitle, route: c.route }))}
              onSelect={(item) => {
                if (item.route === 'ml') setShowMachineLearning(true);
                if (item.route === 'dl') setShowDeepLearning(true);
              }}
            />
          </div>

          <div className="card-grid">
            {dashboard.cards.map((card) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                subtitle={card.subtitle}
                accent={card.accent}
                onClick={() => {
                  if (card.route === 'ml') {
                    setShowMachineLearning(true);
                  }
                  if (card.route === 'dl') {
                    setShowDeepLearning(true);
                  }
                }}
              />
            ))}
          </div>

          <div className="rag-card-wrapper">
            <button type="button" className="rag-card" onClick={() => setShowMachineLearning(false)}>
              <span className="card-title">{dashboard.rag.title}</span>
              <span className="card-subtitle">{dashboard.rag.subtitle}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
