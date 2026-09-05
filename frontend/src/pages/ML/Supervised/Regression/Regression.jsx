import { useEffect, useState } from 'react';
import LinearRegression from './LinearRegression/LinearRegression';
import SearchBar from '../../../../components/common/SearchBar';
import MultipleLinearRegression from './MultipleLinearRegression/MultipleLinearRegression';
import PolynomialRegression from './PolynomialRegression/PolynomialRegression';
import RidgeRegression from './RidgeRegression/RidgeRegression';
import DecisionTree from './DecisionTree/DecisionTree';
import RandomForest from './RandomForest/RandomForest';
import XgBoost from './XgBoost/XgBoost';
import Svr from './Svr/Svr';
import Knn from './Knn/Knn';
import { fetchModelData } from '../../../../services/modelApi';

function Regression({ onBack }) {
  const [items, setItems] = useState([]);
  const [screen, setScreen] = useState('main');

  const routeToScreen = (route) => {
    if (!route) return 'main';
    const r = route.toString();
    if (r === 'linear' || r === 'linear-regression') return 'linear';
    if (r === 'multiple-linear' || r === 'multiple-linear-regression') return 'multiple-linear';
    if (r === 'polynomial' || r === 'polynomial-regression') return 'polynomial';
    if (r === 'ridge' || r === 'ridge-regression') return 'ridge';
    if (r === 'decision-tree') return 'decision-tree';
    if (r === 'random-forest') return 'random-forest';
    if (r === 'xgboost') return 'xgboost';
    if (r === 'svr') return 'svr';
    if (r === 'knn') return 'knn';
    // default: return raw route so unknown routes can still be set
    return r;
  };

  useEffect(() => {
    fetchModelData()
      .then((data) => setItems(data.regression || []))
      .catch(() => setItems([]));
  }, []);

  if (screen === 'linear') {
    return <LinearRegression onNavigate={() => setScreen('main')} />;
  }

  if (screen === 'multiple-linear') {
    return <MultipleLinearRegression onNavigate={() => setScreen('main')} />;
  }

    if (screen === 'polynomial') {
    return <PolynomialRegression onNavigate={() => setScreen('main')} />;
  }

  if (screen === 'ridge') {
    return <RidgeRegression onNavigate={() => setScreen('main')} />;
  }

  if (screen === 'decision-tree') {
    return <DecisionTree onNavigate={() => setScreen('main')} />;
  }

  if(screen === 'random-forest') {
    return <RandomForest onNavigate={() => setScreen('main')} />;
  }

  if(screen === 'xgboost') {
    return <XgBoost onNavigate={() => setScreen('main')} />;
  }

  if(screen === 'svr') {
    return <Svr onNavigate={() => setScreen('main')} />;
  }

  if(screen === 'knn') {
    return <Knn onNavigate={() => setScreen('main')} />;
  }

  return (
    <div className="flow-page">
      <div className="page-header-row">
        <button type="button" className="back-button" onClick={onBack}>← Back</button>
        <h2>Regression</h2>
      </div>

      <SearchBar
        placeholder="Search regression models..."
        items={items.map((it) => ({ label: it.label, subtitle: it.description || '', route: it.route, enabled: it.enabled }))}
        onSelect={(itm) => {
          if (!itm.enabled) return;
          setScreen(routeToScreen(itm.route));
        }}
      />

      <div className="stack-panel">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`list-item ${item.enabled ? 'enabled' : 'disabled'} ${routeToScreen(item.route) === screen ? 'selected' : ''}`}
            onClick={() => item.enabled && setScreen(routeToScreen(item.route))}
            disabled={!item.enabled}
          >
            {item.label}
            {!item.enabled && <span className="coming-soon">Coming soo</span>}
          </button>
        ))}  
      </div>
    </div>
  );
}

export default Regression;
