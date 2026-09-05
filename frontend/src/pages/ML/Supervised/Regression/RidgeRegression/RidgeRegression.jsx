import { useState } from 'react';
import {
  analyzeDataset,
  trainRidgeRegression,
  uploadDataset,
  downloadRidgeRegressionModel,
} from './RidgeRegressionApi';

function RidgeRegression({ onNavigate }) {
  const [selectedDataType, setSelectedDataType] = useState('Structured');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [featureOptions, setFeatureOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState('');

  const [alpha, setAlpha] = useState(1.0);

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

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file.');
      return;
    }

    setUploadedFileName(file.name);
    setIsAnalyzing(true);
    setErrorMessage('');
    setShowTrainingResult(false);
    setResult(null);

    try {
      await uploadDataset(file);

      const analysis = await analyzeDataset(file);
      const columns = analysis.columns || [];

      if (columns.length < 2) {
        setErrorMessage(
          'The CSV must contain at least one feature column and one target column.'
        );

        setFeatureOptions([]);
        setTargetOptions([]);
        setFeatures([]);
        setTarget('');
        setUploadedFileName('');

        return;
      }

      setFeatureOptions(columns);
      setTargetOptions(columns);

      // First column as target
      const defaultTarget = columns[0];

      // Other columns as default features
      const defaultFeatures = columns.filter(
        (column) => column !== defaultTarget
      );

      setTarget(defaultTarget);
      setFeatures(defaultFeatures);
    } catch (error) {
      console.error('CSV analysis failed', error);

      setErrorMessage(
        error.message || 'Unable to analyze this CSV. Please upload a valid file.'
      );

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
    // Target cannot be selected as feature
    if (feature === target) {
      setErrorMessage(
        'The target column cannot be selected as a feature.'
      );
      return;
    }

    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature]
    );

    setErrorMessage('');
  };

  const handleTargetChange = (event) => {
    const newTarget = event.target.value;

    setTarget(newTarget);

    // Remove target from selected features
    setFeatures((prev) =>
      prev.filter((feature) => feature !== newTarget)
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
      setErrorMessage(
        'Please select at least one feature column before training.'
      );
      return;
    }

    if (features.includes(target)) {
      setErrorMessage(
        'The target column cannot be selected as a feature.'
      );
      return;
    }

    if (!alpha || alpha <= 0) {
      setErrorMessage('Alpha must be greater than 0.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        modelName: 'Ridge Regression',
        datasetName: uploadedFileName,
        target,
        features,
        alpha,
      };

      const data = await trainRidgeRegression(payload);

      setResult({
        ...data,
        artifactName:
          data.artifactName || 'ridge-regression-model.joblib',
      });

      setShowTrainingResult(true);
      setShowDetails(false);
    } catch (error) {
      console.error('Ridge Regression training failed', error);

      setErrorMessage(
        error.message || 'Unable to train the Ridge Regression model.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadModel = async () => {
    if (!result) {
      return;
    }

    try {
      await downloadRidgeRegressionModel(
        result.artifactName
      );
    } catch (error) {
      console.error('Model download failed', error);

      setErrorMessage(
        error.message || 'Unable to download the model.'
      );
    }
  };

  const usageSnippet = result
    ? `import joblib

# Load the trained Ridge Regression model
model = joblib.load(
    "models/trained/${result.artifactName || 'ridge-regression-model.joblib'}"
)

# Use the same feature order as the trained model
feature_values = [${(result.features || []).map(() => 0).join(', ')}]

prediction = model.predict([feature_values])[0]

print(f"Prediction: {prediction}")
`
    : '';

  return (
    <div className="flow-page linear-workflow">

      {/* Header */}
      <div className="page-header-row">
        <button
          type="button"
          className="back-button"
          onClick={() => onNavigate('regression')}
        >
          ← Back
        </button>

        <h2>Ridge Regression</h2>
      </div>

      <div className="stepper">

        {/* STEP 1 */}
        <div className="step-box">
          <h3>Step 1</h3>
          <p>Select Data Type</p>

          <div className="option-list">

            <label
              className={`radio-option ${
                selectedDataType === 'Structured'
                  ? 'selected'
                  : ''
              }`}
            >
              <input
                type="radio"
                name="dataType"
                checked={selectedDataType === 'Structured'}
                onChange={() =>
                  setSelectedDataType('Structured')
                }
              />

              Structured
            </label>

            <label className="radio-option disabled-option">
              <input
                type="radio"
                name="dataType"
                disabled
              />

              Semi-Structured
              <span>Coming Soon</span>
            </label>

            <label className="radio-option disabled-option">
              <input
                type="radio"
                name="dataType"
                disabled
              />

              Unstructured
              <span>Coming Soon</span>
            </label>

          </div>
        </div>

        {/* STEP 2 */}
        <div className="step-box">
          <h3>Step 2</h3>
          <p>Upload Dataset</p>

          <label className="upload-box">

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />

            <span className="upload-label">
              {uploadedFileName || 'Drop CSV file here'}
            </span>

            <span className="browse">
              {isAnalyzing
                ? 'Analyzing...'
                : 'Browse Files'}
            </span>

          </label>

          {errorMessage && (
            <p
              className="empty-state"
              style={{
                marginTop: '12px',
                color: '#f87171',
              }}
            >
              {errorMessage}
            </p>
          )}
        </div>

        {/* STEP 3 */}
        <div className="step-box">
          <h3>Step 3</h3>
          <p>Configure Dataset</p>

          <div className="config-panel">

            {/* FEATURES */}
            <div className="config-row">

              <span className="label">
                Features
              </span>

              <div className="check-group">

                {featureOptions.length === 0 ? (

                  <span className="empty-state">
                    Upload a CSV file to detect columns
                  </span>

                ) : (

                  featureOptions.map((feature) => (

                    <label
                      key={feature}
                      className="check-option"
                    >

                      <input
                        type="checkbox"
                        checked={features.includes(feature)}
                        disabled={feature === target}
                        onChange={() =>
                          handleFeatureToggle(feature)
                        }
                      />

                      {feature}

                    </label>

                  ))

                )}

              </div>

            </div>

            {/* TARGET */}
            <div className="config-row target-row">

              <span className="label">
                Target
              </span>

              {targetOptions.length === 0 ? (

                <span className="empty-state">
                  No target column detected
                </span>

              ) : (

                <select
                  value={target}
                  onChange={handleTargetChange}
                >

                  {targetOptions.map((option) => (

                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>

                  ))}

                </select>

              )}

            </div>

            {/* ALPHA */}
            <div className="config-row target-row">

              <span className="label">
                Regularization Strength (Alpha)
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >

                <select
                  value={alpha}
                  onChange={(event) =>
                    setAlpha(Number(event.target.value))
                  }
                >
                  <option value={0.01}>0.01</option>
                  <option value={0.1}>0.1</option>
                  <option value={1}>1.0</option>
                  <option value={10}>10</option>
                  <option value={100}>100</option>
                </select>

                <span
                  title="Alpha controls the strength of regularization. Lower Alpha means less regularization, while higher Alpha means stronger regularization. A common starting value is 1.0."
                  style={{
                    cursor: 'help',
                    fontSize: '18px',
                  }}
                >
                  ⓘ
                </span>

              </div>

            </div>

            {/* ALPHA EXPLANATION */}
            <div
              style={{
                marginTop: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: '1.5',
                opacity: 0.8,
              }}
            >
    
            </div>

          </div>
        </div>

        {/* TRAIN */}
        <div className="step-box actions-box">

          <button
            type="button"
            className="train-button"
            onClick={handleTrain}
            disabled={
              loading ||
              isAnalyzing ||
              !uploadedFileName
            }
          >
            {loading
              ? 'Training...'
              : 'Train Model'}
          </button>

        </div>

      </div>

      {/* RESULTS */}
      {showTrainingResult && result && (

        <div className="results-card">

          <h3>Training Completed</h3>

          <div className="result-grid">

            <div className="result-row">
              <span>Model</span>
              <strong>{result.model}</strong>
            </div>

            <div className="result-row">
              <span>Dataset</span>
              <strong>{result.dataset}</strong>
            </div>

            <div className="metrics">

              <div className="metric">
                <span>R² Score</span>
                <strong>
                  {Number(result.r2Score).toFixed(2)}
                </strong>
              </div>

              <div className="metric">
                <span>MAE</span>
                <strong>
                  {Number(result.mae).toLocaleString()}
                </strong>
              </div>

              <div className="metric">
                <span>RMSE</span>
                <strong>
                  {Number(result.rmse).toLocaleString()}
                </strong>
              </div>

            </div>

            <div className="result-block">

              <span>Features</span>

              <ul>
                {(result.features || []).map((feature) => (
                  <li key={feature}>
                    • {feature}
                  </li>
                ))}
              </ul>

            </div>

            <div className="result-row">
              <span>Target</span>
              <strong>{result.target}</strong>
            </div>

            <div className="result-row">
              <span>Alpha</span>
              <strong>{result.alpha ?? alpha}</strong>
            </div>

          </div>

          <div className="result-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={handleDownloadModel}
            >
              Download Model
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setShowDetails((prev) => !prev)
              }
            >
              View Details
            </button>

          </div>

          {/* CODE */}
          <div
            className="detail-panel"
            style={{ marginTop: '18px' }}
          >

            <p>
              <strong>
                How to use this model in code
              </strong>
            </p>

            <pre
              style={{
                margin: 0,
                padding: '14px 16px',
                borderRadius: '10px',
                overflowX: 'auto',
                background: '#07131f',
                border:
                  '1px solid rgba(148, 163, 184, 0.18)',
                color: '#e2e8f0',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {usageSnippet}
            </pre>

          </div>

          {/* DETAILS */}
          {showDetails && (

            <div
              className="detail-panel"
              style={{ marginTop: '18px' }}
            >

              <p>
                <strong>Dataset:</strong>{' '}
                {result.dataset}
              </p>

              <p>
                <strong>Model:</strong>{' '}
                {result.model}
              </p>

              <p>
                <strong>Target:</strong>{' '}
                {result.target}
              </p>

              <p>
                <strong>Features:</strong>{' '}
                {(result.features || []).join(', ')}
              </p>

              <p>
                <strong>Alpha:</strong>{' '}
                {result.alpha ?? alpha}
              </p>

              <p>
                <strong>Artifact:</strong>{' '}
                {result.artifactName}
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default RidgeRegression;