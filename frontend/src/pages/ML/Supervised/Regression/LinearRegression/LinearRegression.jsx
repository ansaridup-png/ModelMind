import { useState } from 'react';
import { analyzeDataset, trainLinearRegression, uploadDataset } from './linearRegressionApi';

function LinearRegression({ onNavigate }) {
  const [selectedDataType, setSelectedDataType] = useState('Structured');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [featureOptions, setFeatureOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState('');
  const [showTrainingResult, setShowTrainingResult] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadedFileName(file.name);
    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      await uploadDataset(file);
      const analysis = await analyzeDataset(file);
      const columns = analysis.columns || [];

      if (columns.length > 2) {
        setErrorMessage('Linear Regression allows a maximum of 2 feature columns. Please upload a CSV with at most 2 features and 1 target column.');
        setFeatureOptions([]);
        setTargetOptions([]);
        setFeatures([]);
        setTarget('');
        setUploadedFileName('');
        return;
      }

      const defaultTarget = columns[0] || '';
      const defaultFeatures = columns.filter((column) => column !== defaultTarget);

      setFeatureOptions(columns);
      setTargetOptions(columns);
      setTarget(defaultTarget);
      setFeatures(defaultFeatures);
    } catch (error) {
      console.error('CSV analysis failed', error);
      setErrorMessage('Unable to analyze this CSV. Please upload a valid file.');
      setFeatureOptions([]);
      setTargetOptions([]);
      setFeatures([]);
      setTarget('');
      setUploadedFileName('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeatureToggle = (feature) => {
    if (feature === target) {
      setErrorMessage('The target column cannot be selected as a feature.');
      return;
    }

    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((item) => item !== feature) : [...prev, feature]
    );
    setErrorMessage('');
  };

  const handleTrain = async () => {
    if (!uploadedFileName) {
      setErrorMessage('Please upload a CSV file before training.');
      return;
    }

    if (!target) {
      setErrorMessage('Please select a target column before training.');
      return;
    }

    if (features.length === 0) {
      setErrorMessage('Please select at least one feature column before training.');
      return;
    }

    if (features.includes(target)) {
      setErrorMessage('The target column cannot be selected as a feature.');
      return;
    }

    if (features.length > 2) {
      setErrorMessage('Linear Regression supports only up to 2 feature columns.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        modelName: 'Linear Regression',
        datasetName: uploadedFileName,
        target,
        features,
      };

      const data = await trainLinearRegression(payload);
      setResult({
        ...data,
        artifactName: data.artifactName || 'linear-regression-model.joblib',
      });
      setShowTrainingResult(true);
      setShowDetails(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadModel = () => {
    if (!result) {
      return;
    }

    const fileName = result.artifactName || 'linear-regression-model.joblib';
    const link = document.createElement('a');
    link.href = `http://localhost:8080/api/regression/download?fileName=${encodeURIComponent(fileName)}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const usageSnippet = result
    ? `import joblib\n\n# Load the trained model\nmodel = joblib.load("models/trained/${result.artifactName || 'linear-regression-model.joblib'}")\n\n# Use the same feature order as the trained model\nfeature_values = [${(result.features || []).map(() => 0).join(', ')}]\nprediction = model.predict([feature_values])[0]\nprint(f"Prediction: {prediction}")\n`
    : '';

  return (
    <div className="flow-page linear-workflow">
      <div className="page-header-row">
        <button type="button" className="back-button" onClick={() => onNavigate('regression')}>← Back</button>
        <h2>Linear Regression</h2>
      </div>

      <div className="stepper">
        <div className="step-box">
          <h3>Step 1</h3>
          <p>Select Data Type</p>
          <div className="option-list">
            <label className={`radio-option ${selectedDataType === 'Structured' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="dataType"
                checked={selectedDataType === 'Structured'}
                onChange={() => setSelectedDataType('Structured')}
              />
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
              onChange={handleFileChange}
            />
            <span className="upload-label">{uploadedFileName || 'Drop CSV file here'}</span>
            <span className="browse">{isAnalyzing ? 'Analyzing...' : 'Browse Files'}</span>
          </label>
          {errorMessage && (
            <p className="empty-state" style={{ marginTop: '12px', color: '#f87171' }}>
              {errorMessage}
            </p>
          )}
        </div>

        <div className="step-box">
          <h3>Step 3</h3>
          <p>Configure Dataset</p>
          <div className="config-panel">
            <div className="config-row">
              <span className="label">Features</span>
              <div className="check-group">
                {featureOptions.length === 0 ? (
                  <span className="empty-state">Upload a CSV file to detect columns</span>
                ) : (
                  featureOptions.map((feature) => (
                    <label key={feature} className="check-option">
                      <input
                        type="checkbox"
                        checked={features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                      />
                      {feature}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="config-row target-row">
              <span className="label">Target</span>
              {targetOptions.length === 0 ? (
                <span className="empty-state">No target column detected</span>
              ) : (
                <select value={target} onChange={(event) => setTarget(event.target.value)}>
                  {targetOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="step-box actions-box">
          <button type="button" className="train-button" onClick={handleTrain} disabled={loading || !uploadedFileName || features.length === 0 || !target}>
            {loading ? 'Training...' : 'Train Model'}
          </button>
        </div>
      </div>

      {showTrainingResult && result && (
        <div className="results-card">
          <h3>Training Completed</h3>
          <div className="result-grid">
            <div className="result-row"><span>Model</span><strong>{result.model}</strong></div>
            <div className="result-row"><span>Dataset</span><strong>{result.dataset}</strong></div>
            <div className="metrics">
              <div className="metric"><span>R² Score</span><strong>{result.r2Score.toFixed(2)}</strong></div>
              <div className="metric"><span>MAE</span><strong>{result.mae.toLocaleString()}</strong></div>
              <div className="metric"><span>RMSE</span><strong>{result.rmse.toLocaleString()}</strong></div>
            </div>
            <div className="result-block">
              <span>Features</span>
              <ul>
                {result.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="result-row"><span>Target</span><strong>{result.target}</strong></div>
          </div>
          <div className="result-actions">
            <button type="button" className="secondary-button" onClick={handleDownloadModel}>Download Model</button>
            <button type="button" className="secondary-button" onClick={() => setShowDetails((prev) => !prev)}>View Details</button>
          </div>

          <div className="detail-panel" style={{ marginTop: '18px' }}>
            <p><strong>How to use this model in code</strong></p>
            <pre style={{
              margin: 0,
              padding: '14px 16px',
              borderRadius: '10px',
              overflowX: 'auto',
              background: '#07131f',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              color: '#e2e8f0',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {usageSnippet}
            </pre>
          </div>

          {showDetails && (
            <div className="detail-panel" style={{ marginTop: '18px' }}>
              <p><strong>Dataset:</strong> {result.dataset}</p>
              <p><strong>Model:</strong> {result.model}</p>
              <p><strong>Target:</strong> {result.target}</p>
              <p><strong>Features:</strong> {result.features.join(', ')}</p>
              <p><strong>Artifact:</strong> {result.artifactName}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LinearRegression;
