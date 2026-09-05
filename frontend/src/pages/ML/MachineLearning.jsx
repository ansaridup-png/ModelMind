import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import SupervisedLearning from './Supervised/SupervisedLearning';
import { fetchModelData } from '../../services/modelApi';

function MachineLearning({ onBack }) {
  const [items, setItems] = useState([]);
  const [screen, setScreen] = useState('main');

  useEffect(() => {
    fetchModelData()
      .then((data) => setItems(data.main || []))
      .catch(() => setItems([]));
  }, []);

  if (screen === 'supervised') {
    return <SupervisedLearning onBack={() => setScreen('main')} />;
  }

  return (
    <div className="flow-page">
      <div className="page-header-row">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <h2>Machine Learning</h2>
      </div>

      <SearchBar
        placeholder="Search ML pages, algorithms..."
        items={items.map((it) => ({ label: it.label, subtitle: it.description || '', route: it.route, enabled: it.enabled }))}
        onSelect={(itm) => {
          if (!itm.enabled) return;
          if (itm.route === 'supervised') setScreen('supervised');
        }}
      />

      <div className="stack-panel">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`list-item ${item.enabled ? 'enabled selected' : 'disabled'}`}
            onClick={() => item.enabled && item.route === 'supervised' && setScreen('supervised')}
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

export default MachineLearning;
