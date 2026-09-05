import { useEffect, useState } from 'react';
import Regression from './Regression/Regression';
import SearchBar from '../../../components/common/SearchBar';
import { fetchModelData } from '../../../services/modelApi';

function SupervisedLearning({ onBack }) {
  const [items, setItems] = useState([]);
  const [screen, setScreen] = useState('main');

  useEffect(() => {
    fetchModelData()
      .then((data) => setItems(data.supervised || []))
      .catch(() => setItems([]));
  }, []);

  if (screen === 'regression') {
    return <Regression onBack={() => setScreen('main')} />;
  }

  return (
    <div className="flow-page">
      <div className="page-header-row">
        <button type="button" className="back-button" onClick={onBack}>← Back</button>
        <h2>Supervised Learning</h2>
      </div>

      <SearchBar
        placeholder="Search supervised pages or models..."
        items={items.map((it) => ({ label: it.label, subtitle: it.description || '', route: it.route, enabled: it.enabled }))}
        onSelect={(itm) => {
          if (!itm.enabled) return;
          if (itm.route === 'regression') setScreen('regression');
        }}
      />

      <div className="stack-panel">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`list-item ${item.enabled ? 'enabled selected' : 'disabled'}`}
            onClick={() => item.enabled && item.route === 'regression' && setScreen('regression')}
            disabled={!item.enabled}
          >
            {item.label}
            {!item.enabled && <span className="coming-soon">Coming soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SupervisedLearning;
