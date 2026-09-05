import { useState } from 'react';
import {
  analyzeDataset,
  trainMultipleLinearRegression,
  uploadDataset,
  downloadMultipleLinearRegressionModel,
} from './MultipleLinearRegressionApi';

function MultipleLinearRegression({ onNavigate }) {
  const [selectedDataType, setSelectedDataType] = useState('Structured');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [columns, setColumns] = useState([]);
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState('');
  const [showTrainingResult, setShowTrainingResult] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
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
      const detectedColumns = analysis.columns || [];

      if (detectedColumns.length < 2) {
        setErrorMessage('Multiple Linear Regression requires at least 2 feature columns and 1 target column.');
        setColumns([]);
        setFeatures([]);
        setTarget('');
        setUploadedFileName('');
        return;
      }

      setColumns(detectedColumns);
      setFeatures([]);
      setTarget('');
      setResult(null);
      setShowTrainingResult(false);
    } catch (error) {
      console.error('Dataset analysis failed:', error);
      setErrorMessage('Unable to analyze the CSV file. Please upload a valid dataset.');
      setColumns([]);
      setFeatures([]);
      setTarget('');
      setUploadedFileName('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeatureToggle = (column) => {
    if (column === target) {
      return;
    }

    setFeatures((previousFeatures) => {
      if (previousFeatures.includes(column)) {
        return previousFeatures.filter((feature) => feature !== column);
      }
      return [...previousFeatures, column];
    });
  };

  const handleTargetChange = (event) => {
    const selectedTarget = event.target.value;
    setTarget(selectedTarget);
    setFeatures((previousFeatures) =>
      previousFeatures.filter((feature) => feature !== selectedTarget)
    );
  };

  const handleTrain = async () => {
    if (!uploadedFileName) {
      setErrorMessage('Please upload a CSV file before training.');
      return;
    }

    if (features.length < 2) {
      setErrorMessage('Multiple Linear Regression requires at least 2 feature columns.');
      return;
    }

    if (!target) {
      setErrorMessage('Please select a target column before training.');
      return;
    }

    setIsTraining(true);
    setErrorMessage('');
    setResult(null);

    try {
      const payload = {
        modelName: 'Multiple Linear Regression',
        datasetName: uploadedFileName,
        features,
        target,
      };

      const trainingResult = await trainMultipleLinearRegression(payload);
      setResult({
        ...trainingResult,
        artifactName: trainingResult.artifactName || 'multiple-linear-regression-model.joblib',
      });
      setShowTrainingResult(true);
      setShowDetails(false);
    } catch (error) {
      console.error('Multiple Linear Regression training failed:', error);
      setErrorMessage('Model training failed. Please try again with a valid dataset.');
    } finally {
      setIsTraining(false);
    }
  };

  const handleDownloadModel = async () => {
    if (!result) {
      return;
    }

    try {
      await downloadMultipleLinearRegressionModel(
        result.artifactName || 'multiple-linear-regression-model.joblib'
      );
    } catch (error) {
      console.error('Model download failed:', error);
      setErrorMessage('Unable to download model.');
    }
  };

  const usageSnippet = result
    ? `import joblib\n\n# Load the trained model\nmodel = joblib.load("models/trained/${result.artifactName || 'multiple-linear-regression-model.joblib'}")\n\n# Example values in the same order as the trained features\nfeature_values = [${(result.features || []).map(() => 0).join(', ')}]\nprediction = model.predict([feature_values])[0]\nprint(f"Prediction: {prediction}")\n`
    : '';

  return (
    <div className="flow-page linear-workflow">
      <div className="page-header-row">
        <button type="button" className="back-button" onClick={() => onNavigate('regression')}>← Back</button>
        <h2>Multiple Linear Regression</h2>
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
            <input type="file" accept=".csv" onChange={handleFileChange} />
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
                {columns.length === 0 ? (
                  <span className="empty-state">Upload a CSV file to detect columns</span>
                ) : (
                  columns.map((column) => (
                    <label key={column} className={`check-option ${column === target ? 'disabled-option' : ''}`}>
                      <input
                        type="checkbox"
                        checked={features.includes(column)}
                        disabled={column === target}
                        onChange={() => handleFeatureToggle(column)}
                      />
                      {column}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="config-row target-row">
              <span className="label">Target</span>
              {columns.length === 0 ? (
                <span className="empty-state">No target column detected</span>
              ) : (
                <select value={target} onChange={handleTargetChange}>
                  <option value="">Select target column</option>
                  {columns.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="step-box actions-box">
          <button
            type="button"
            className="train-button"
            onClick={handleTrain}
            disabled={isTraining || !uploadedFileName || features.length < 2 || !target}
          >
            {isTraining ? 'Training...' : 'Train Model'}
          </button>
        </div>
      </div>

      {showTrainingResult && result && (
        <div className="results-card">
          <h3>Training Completed</h3>
          <div className="result-grid">
            <div className="result-row"><span>Model</span><strong>{result.model || 'Multiple Linear Regression'}</strong></div>
            <div className="result-row"><span>Dataset</span><strong>{result.dataset || uploadedFileName}</strong></div>
            <div className="metrics">
              <div className="metric"><span>R² Score</span><strong>{result.r2Score !== undefined ? Number(result.r2Score).toFixed(2) : '-'}</strong></div>
              <div className="metric"><span>MAE</span><strong>{result.mae !== undefined ? Number(result.mae).toLocaleString() : '-'}</strong></div>
              <div className="metric"><span>RMSE</span><strong>{result.rmse !== undefined ? Number(result.rmse).toLocaleString() : '-'}</strong></div>
            </div>
            <div className="result-block">
              <span>Features</span>
              <ul>
                {(result.features || features).map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="result-row"><span>Target</span><strong>{result.target || target}</strong></div>
          </div>
          <div className="result-actions">
            <button type="button" className="secondary-button" onClick={handleDownloadModel}>Download Model</button>
            <button type="button" className="secondary-button" onClick={() => setShowDetails((prev) => !prev)}>
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
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
              <p><strong>Dataset:</strong> {result.dataset || uploadedFileName}</p>
              <p><strong>Model:</strong> {result.model || 'Multiple Linear Regression'}</p>
              <p><strong>Target:</strong> {result.target || target}</p>
              <p><strong>Features:</strong> {(result.features || features).join(', ')}</p>
              <p><strong>Artifact:</strong> {result.artifactName || 'N/A'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultipleLinearRegression;