from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from sklearn.compose import TransformedTargetRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR

router = APIRouter(prefix='/api')

ALLOWED_KERNELS = {'rbf', 'linear', 'poly', 'sigmoid'}


class TrainingRequest(BaseModel):
    model_name: str
    dataset_name: str
    target: str
    features: list[str]
    # Width of the epsilon-tube: errors smaller than this are not penalised
    epsilon: float = 0.1
    kernel: str = 'rbf'


class TrainingResponse(BaseModel):
    model: str
    dataset: str
    r2_score: float
    mae: float
    rmse: float
    features: list[str]
    target: str
    artifact_name: str


@router.post('/train/svr')
def train_svr(request: TrainingRequest):
    project_root = Path(__file__).resolve().parents[3]
    dataset_path = project_root / 'data' / 'uploaded' / request.dataset_name
    print(
        f"epsilon: {request.epsilon}, kernel: {request.kernel}, features: {request.features}, target: {request.target}"
    )

    if not dataset_path.exists():
        uploaded_dir = project_root / 'data' / 'uploaded'
        uploaded_dir.mkdir(parents=True, exist_ok=True)
        raise FileNotFoundError(
            f'Dataset not found: {dataset_path}. Upload the CSV to {uploaded_dir} before training.'
        )

    kernel = (request.kernel or 'rbf').lower()
    if kernel not in ALLOWED_KERNELS:
        raise ValueError(
            f'Unsupported kernel: {request.kernel}. Choose one of {sorted(ALLOWED_KERNELS)}.'
        )

    if request.epsilon < 0:
        raise ValueError('Epsilon must be zero or greater.')

    df = pd.read_csv(dataset_path)
    selected_features = [col for col in request.features if col in df.columns]

    if not selected_features:
        raise ValueError('No valid feature columns found in dataset.')

    if request.target not in df.columns:
        raise ValueError(f'Target column not found: {request.target}')

    X = df[selected_features].apply(pd.to_numeric, errors='coerce').fillna(0).values
    y = pd.to_numeric(df[request.target], errors='coerce').fillna(0).values

    # SVR is distance based, so both the features and the target have to be
    # scaled before fitting - the default penalty C=1 underfits badly on a raw
    # target. The user's epsilon is in real target units, so it gets divided by
    # the target spread to land in the same scaled space. Keeping the scalers
    # inside the artifact means predict() still takes and returns raw values.
    target_spread = float(np.std(y))
    if target_spread <= 0:
        target_spread = 1.0

    regressor = Pipeline([
        ('scaler', StandardScaler()),
        ('svr', SVR(kernel=kernel, epsilon=request.epsilon / target_spread)),
    ])
    model = TransformedTargetRegressor(regressor=regressor, transformer=StandardScaler())
    model.fit(X, y)
    predictions = model.predict(X)

    artifact_dir = project_root / 'models' / 'trained'
    artifact_dir.mkdir(parents=True, exist_ok=True)
    artifact_name = f'{request.dataset_name.replace(".csv", "")}_svr.joblib'
    artifact_path = artifact_dir / artifact_name
    joblib.dump(model, artifact_path)

    if dataset_path.exists():
        dataset_path.unlink()

    return TrainingResponse(
        model='Support Vector Regression',
        dataset=request.dataset_name,
        r2_score=float(r2_score(y, predictions)),
        mae=float(mean_absolute_error(y, predictions)),
        rmse=float(np.sqrt(mean_squared_error(y, predictions))),
        features=selected_features,
        target=request.target,
        artifact_name=artifact_name,
    )
