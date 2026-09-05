import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import { fetchDlModelData } from '../../services/modelApi';

function DeepLearning({ onBack }) {
  const [items, setItems] = useState([]);
  const [screen, setScreen] = useState('main');

  useEffect(() => {
    fetchDlModelData()
      .then((data) => setItems(data.main || []))
      .catch(() => setItems([]));
  }, []);



  return (
    <div className="flow-page">
      <div className="page-header-row">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <h2>Deep Learning</h2>
      </div>

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

export default DeepLearning;
