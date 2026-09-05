from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

router = APIRouter(prefix='/api')

ALLOWED_WEIGHTS = {'uniform', 'distance'}


class TrainingRequest(BaseModel):
    model_name: str
    dataset_name: str
    target: str
    features: list[str]
    # Number of nearest neighbours averaged for each prediction
    n_neighbors: int = 5
    weights: str = 'uniform'


class TrainingResponse(BaseModel):
    model: str
    dataset: str
    r2_score: float
    mae: float
    rmse: float
    features: list[str]
    target: str
    artifact_name: str


@router.post('/train/knn')
def train_knn(request: TrainingRequest):
    project_root = Path(__file__).resolve().parents[3]
    dataset_path = project_root / 'data' / 'uploaded' / request.dataset_name
    print(
        f"n_neighbors: {request.n_neighbors}, weights: {request.weights}, features: {request.features}, target: {request.target}"
    )

    if not dataset_path.exists():
        uploaded_dir = project_root / 'data' / 'uploaded'
        uploaded_dir.mkdir(parents=True, exist_ok=True)
        raise FileNotFoundError(
            f'Dataset not found: {dataset_path}. Upload the CSV to {uploaded_dir} before training.'
        )

    weights = (request.weights or 'uniform').lower()
    if weights not in ALLOWED_WEIGHTS:
        raise ValueError(
            f'Unsupported weights: {request.weights}. Choose one of {sorted(ALLOWED_WEIGHTS)}.'
        )

    if request.n_neighbors < 1:
        raise ValueError('Number of neighbours must be at least 1.')

    df = pd.read_csv(dataset_path)
    selected_features = [col for col in request.features if col in df.columns]

    if not selected_features:
        raise ValueError('No valid feature columns found in dataset.')

    if request.target not in df.columns:
        raise ValueError(f'Target column not found: {request.target}')

    X = df[selected_features].apply(pd.to_numeric, errors='coerce').fillna(0).values
    y = pd.to_numeric(df[request.target], errors='coerce').fillna(0).values

    # KNN cannot use more neighbours than there are rows to look at.
    n_neighbors = min(request.n_neighbors, len(X))

    # KNN is distance based, so the features have to be scaled before fitting
    # or the widest ranging column decides every neighbour. Keeping the scaler
    # inside the artifact means predict() takes raw values.
    model = Pipeline([
        ('scaler', StandardScaler()),
        ('knn', KNeighborsRegressor(n_neighbors=n_neighbors, weights=weights)),
    ])
    model.fit(X, y)
    predictions = model.predict(X)

    artifact_dir = project_root / 'models' / 'trained'
    artifact_dir.mkdir(parents=True, exist_ok=True)
    artifact_name = f'{request.dataset_name.replace(".csv", "")}_knn.joblib'
    artifact_path = artifact_dir / artifact_name
    joblib.dump(model, artifact_path)

    if dataset_path.exists():
        dataset_path.unlink()

    return TrainingResponse(
        model='KNN Regression',
        dataset=request.dataset_name,
        r2_score=float(r2_score(y, predictions)),
        mae=float(mean_absolute_error(y, predictions)),
        rmse=float(np.sqrt(mean_squared_error(y, predictions))),
        features=selected_features,
        target=request.target,
        artifact_name=artifact_name,
    )
