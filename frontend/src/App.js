import './App.css';
import { useMemo, useState } from 'react';

const dashboardCards = [
  { key: 'ml', title: 'ML', subtitle: 'Machine Learning', accent: 'cyan' },
  { key: 'dl', title: 'DL', subtitle: 'Deep Learning', accent: 'violet' },
  { key: 'ai', title: 'AI', subtitle: 'Generative AI', accent: 'amber' },
];

const mainSections = [
  {
    id: 'ml',
    title: 'Machine Learning',
    items: ['Supervised Learning', 'Unsupervised Learning', 'Semi-Supervised Learning', 'Reinforcement Learning'],
    enabled: ['Supervised Learning'],
  },
];

const supervisedFlow = {
  title: 'Supervised Learning',
  items: ['Regression', 'Classification'],
  enabled: ['Regression'],
};

const regressionFlow = {
  title: 'Regression',
  items: ['Linear Regression', 'Multiple Linear Regression', 'Polynomial Regression', 'Ridge Regression'],
  enabled: ['Linear Regression'],
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedDataType, setSelectedDataType] = useState('Structured');
  const [uploadedFileName, setUploadedFileName] = useState('salary.csv');
  const [features, setFeatures] = useState(['experience', 'age']);
  const [target, setTarget] = useState('salary');
  const [showTrainingResult, setShowTrainingResult] = useState(false);

  const pageTitle = useMemo(() => {
    if (currentView === 'dashboard') return 'ModelMind';
    if (currentView === 'ml') return 'Machine Learning';
    if (currentView === 'supervised') return 'Supervised Learning';
    if (currentView === 'regression') return 'Regression';
    if (currentView === 'linear-regression') return 'Linear Regression';
    return 'ModelMind';
  }, [currentView]);

  const handleDashboardSelect = (key) => {
    if (key === 'ml') {
      setCurrentView('ml');
    }
  };

  const handleFeatureToggle = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    );
  };

  const handleTrain = () => {
    setShowTrainingResult(true);
  };

  const renderDashboard = () => (
    <div className="dashboard-shell">
      <header className="app-header">
        <div className="brand-mark">
          <span className="brand-dot" />
          <span className="brand-label">ModelMind</span>
        </div>
        <div className="tagline-wrap">
          <h1>ModelMind</h1>
          <p className="tagline">From data to decisions.</p>
        </div>
      </header>

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

      <div className="card-grid">
        {dashboardCards.map((card) => (
          <button
            key={card.key}
            className={`tech-card accent-${card.accent}`}
            onClick={() => handleDashboardSelect(card.key)}
            type="button"
          >
            <span className="card-title">{card.title}</span>
            <span className="card-subtitle">{card.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="rag-card-wrapper">
        <button className="rag-card" type="button" onClick={() => setCurrentView('dashboard')}>
          <span className="card-title">RAG</span>
          <span className="card-subtitle">Retrieval Augmented Generation</span>
        </button>
      </div>
    </div>
  );

  const renderSectionList = () => (
    <div className="flow-page">
      <div className="page-header-row">
        <button className="back-button" type="button" onClick={() => setCurrentView('dashboard')}>← Back</button>
        <h2>{pageTitle}</h2>
      </div>

      <div className="section-list">
        {mainSections.map((section) => (
          <div key={section.id} className="stack-panel">
            {section.items.map((item) => {
              const isEnabled = section.enabled.includes(item);
              const isSelected = item === 'Supervised Learning';
              return (
                <button
                  key={item}
                  className={`list-item ${isEnabled ? 'enabled' : 'disabled'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (isEnabled) {
                      setCurrentView('supervised');
                    }
                  }}
                  type="button"
                >
                  {item}
                  {!isEnabled && <span className="coming-soon">Coming soon</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupervised = () => (
    <div className="flow-page">
      <div className="page-header-row">
        <button className="back-button" type="button" onClick={() => setCurrentView('ml')}>← Back</button>
        <h2>{pageTitle}</h2>
      </div>

      <div className="stack-panel">
        {supervisedFlow.items.map((item) => {
          const isEnabled = supervisedFlow.enabled.includes(item);
          const isSelected = item === 'Regression';
          return (
            <button
              key={item}
              className={`list-item ${isEnabled ? 'enabled' : 'disabled'} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (isEnabled) {
                  setCurrentView('regression');
                }
              }}
              type="button"
            >
              {item}
              {!isEnabled && <span className="coming-soon">Coming soon</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRegression = () => (
    <div className="flow-page">
      <div className="page-header-row">
        <button className="back-button" type="button" onClick={() => setCurrentView('supervised')}>← Back</button>
        <h2>{pageTitle}</h2>
      </div>

      <div className="stack-panel">
        {regressionFlow.items.map((item) => {
          const isEnabled = regressionFlow.enabled.includes(item);
          const isSelected = item === 'Linear Regression';
          return (
            <button
              key={item}
              className={`list-item ${isEnabled ? 'enabled' : 'disabled'} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (isEnabled) {
                  setCurrentView('linear-regression');
                }
              }}
              type="button"
            >
              {item}
              {!isEnabled && <span className="coming-soon">Coming soon</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderLinearRegression = () => (
    <div className="flow-page linear-workflow">
      <div className="page-header-row">
        <button className="back-button" type="button" onClick={() => setCurrentView('regression')}>← Back</button>
        <h2>{pageTitle}</h2>
      </div>

      <div className="stepper">
        <div className="step-box">
          <h3>Step 1</h3>
          <p>Select Data Type</p>
          <div className="option-list">
            <label className={`radio-option ${selectedDataType === 'Structured' ? 'selected' : ''}`}>
              <input type="radio" name="dataType" checked={selectedDataType === 'Structured'} onChange={() => setSelectedDataType('Structured')} />
              Structured
            </label>
            <label className="radio-option disabled-option">
              <input type="radio" name="dataType" disabled />
              Semi-Structured <span>Coming Soon</span>
            </label>
            <label className="radio-option disabled-option">
              <input type="radio" name="dataType" disabled />
              Unstructured <span>Coming Soon</span>
            </label>
          </div>
        </div>

        <div className="step-box">
          <h3>Step 2</h3>
          <p>Upload Dataset</p>
          <label className="upload-box">
            <input
              type="file"
              accept=".csv"
              onChange={(event) => setUploadedFileName(event.target.files?.[0]?.name || 'salary.csv')}
            />
            <span className="upload-label">Drop CSV file here</span>
            <span className="browse">Browse Files</span>
          </label>
        </div>

        <div className="step-box">
          <h3>Step 3</h3>
          <p>Configure Dataset</p>
          <div className="config-panel">
            <div className="config-row">
              <span className="label">Features</span>
              <div className="check-group">
                {['experience', 'age', 'education'].map((feature) => (
                  <label key={feature} className="check-option">
                    <input
                      type="checkbox"
                      checked={features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            <div className="config-row target-row">
              <span className="label">Target</span>
              <select value={target} onChange={(event) => setTarget(event.target.value)}>
                <option value="salary">salary</option>
                <option value="revenue">revenue</option>
                <option value="profit">profit</option>
              </select>
            </div>
          </div>
        </div>

        <div className="step-box actions-box">
          <button className="train-button" type="button" onClick={handleTrain}>Train Model</button>
        </div>
      </div>

      {showTrainingResult && (
        <div className="results-card">
          <h3>Training Completed</h3>
          <div className="result-grid">
            <div className="result-row"><span>Model</span><strong>Linear Regression</strong></div>
            <div className="result-row"><span>Dataset</span><strong>{uploadedFileName}</strong></div>
            <div className="metrics">
              <div className="metric"><span>R² Score</span><strong>0.94</strong></div>
              <div className="metric"><span>MAE</span><strong>2,500</strong></div>
              <div className="metric"><span>RMSE</span><strong>3,200</strong></div>
            </div>
            <div className="result-block">
              <span>Features</span>
              <ul>
                {features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
            </div>
            <div className="result-row"><span>Target</span><strong>{target}</strong></div>
          </div>
          <div className="result-actions">
            <button className="secondary-button" type="button">Download Model</button>
            <button className="secondary-button" type="button">View Details</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app-shell">
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'ml' && renderSectionList()}
      {currentView === 'supervised' && renderSupervised()}
      {currentView === 'regression' && renderRegression()}
      {currentView === 'linear-regression' && renderLinearRegression()}
    </div>
  );
}

export default App;
