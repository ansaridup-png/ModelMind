const API_BASE = 'http://localhost:8080/api';

async function request(url, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      ...(isFormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      text || `Request failed: ${response.status}`
    );
  }

  const contentType =
    response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response;
}


// Upload CSV
export async function uploadDataset(file) {
  const formData = new FormData();

  formData.append('file', file);

  return request(
    '/model/regression/multiple/upload',
    {
      method: 'POST',
      body: formData,
    }
  );
}


// Analyze CSV
export async function analyzeDataset(file) {
  const formData = new FormData();

  formData.append('file', file);

  return request(
    '/model/regression/multiple/analyze',
    {
      method: 'POST',
      body: formData,
    }
  );
}


// Train Multiple Linear Regression
export async function trainMultipleLinearRegression(payload) {
  return request(
    '/model/regression/multiple/train',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}


// Download the trained .joblib model artifact
export async function downloadMultipleLinearRegressionModel(artifactName) {
  const fileName = artifactName || 'multiple-linear-regression-model.joblib';

  const response = await fetch(
    `${API_BASE}/model/regression/multiple/download?fileName=${encodeURIComponent(fileName)}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Download failed: ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}