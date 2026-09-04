from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

router = APIRouter(prefix='/api')


class TrainingRequest(BaseModel):
    model_name: str
    dataset_name: str
    target: str
    features: list[str]


class TrainingResponse(BaseModel):
    model: str
    dataset: str
    r2_score: float
    mae: float
    rmse: float
    features: list[str]
    target: str
    artifact_name: str


@router.post('/train/decision-tree')
def train_decision_tree(request: TrainingRequest):
    project_root = Path(__file__).resolve().parents[3]
    dataset_path = project_root / 'data' / 'uploaded' / request.dataset_name

    if not dataset_path.exists():
        uploaded_dir = project_root / 'data' / 'uploaded'
        uploaded_dir.mkdir(parents=True, exist_ok=True)
        raise FileNotFoundError(
            f'Dataset not found: {dataset_path}. Upload the CSV to {uploaded_dir} before training.'
        )

    df = pd.read_csv(dataset_path)
    selected_features = [col for col in request.features if col in df.columns]

    if not selected_features:
        raise ValueError('No valid feature columns found in dataset.')

    if request.target not in df.columns:
        raise ValueError(f'Target column not found: {request.target}')

    X = df[selected_features].apply(pd.to_numeric, errors='coerce').fillna(0).values
    y = pd.to_numeric(df[request.target], errors='coerce').fillna(0).values

    model = DecisionTreeRegressor()
    model.fit(X, y)
    predictions = model.predict(X)

    artifact_dir = project_root / 'models' / 'trained'
    artifact_dir.mkdir(parents=True, exist_ok=True)
    artifact_name = f'{request.dataset_name.replace(".csv", "")}_decision_tree.joblib'
    artifact_path = artifact_dir / artifact_name
    joblib.dump(model, artifact_path)

    if dataset_path.exists():
        dataset_path.unlink()

    return TrainingResponse(
        model='Decision Tree',
        dataset=request.dataset_name,
        r2_score=float(r2_score(y, predictions)),
        mae=float(mean_absolute_error(y, predictions)),
        rmse=float(np.sqrt(mean_squared_error(y, predictions))),
        features=selected_features,
        target=request.target,
        artifact_name=artifact_name,
    )
