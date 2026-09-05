const API_BASE = 'http://localhost:8080/api/randomforest';

async function request(url, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/regression/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function analyzeDataset(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/regression/analyze', {
    method: 'POST',
    body: formData,
  });
}

export async function trainRandomForest(payload) {
  return request('/regression/train', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function downloadRandomForestModel(artifactName) {
  const fileName =
    artifactName || 'random-forest-model.joblib';

  const response = await fetch(
    `${API_BASE}/regression/download?fileName=${encodeURIComponent(fileName)}`
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      text || `Download failed: ${response.status}`
    );
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