from pathlib import Path
from urllib import request

import joblib
import numpy as np
import pandas as pd

from fastapi import APIRouter
from pydantic import BaseModel

from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)
from sklearn.model_selection import train_test_split


router = APIRouter(prefix="/api")


# =========================================================
# Request
# =========================================================

class TrainingRequest(BaseModel):
    model_name: str
    dataset_name: str
    target: str
    features: list[str]


# =========================================================
# Response
# =========================================================

class TrainingResponse(BaseModel):
    model: str
    dataset: str
    r2_score: float
    mae: float
    rmse: float
    features: list[str]
    target: str
    artifact_name: str


# =========================================================
# Multiple Linear Regression
# =========================================================

@router.post("/train/multiple-linear-regression")
def train_multiple_linear_regression(
    request: TrainingRequest
):

    # -----------------------------------------------------
    # Find uploaded dataset
    # -----------------------------------------------------
    project_root = Path(__file__).resolve().parents[3]
    dataset_path = project_root / "data" / "uploaded" / request.dataset_name

    if not dataset_path.exists():

        uploaded_dir = project_root / "data" / "uploaded"

        uploaded_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        raise FileNotFoundError(
            f"Dataset not found: {dataset_path}. "
            f"Upload the CSV to {uploaded_dir} before training."
        )


    # -----------------------------------------------------
    # Read CSV
    # -----------------------------------------------------

    df = pd.read_csv(dataset_path)


    # -----------------------------------------------------
    # Validate features
    # -----------------------------------------------------

    if not request.features:
        raise ValueError(
            "At least 2 feature columns are required "
            "for Multiple Linear Regression."
        )

    if len(request.features) < 2:
        raise ValueError(
            "Multiple Linear Regression requires "
            "at least 2 features."
        )


    # -----------------------------------------------------
    # Check feature columns
    # -----------------------------------------------------

    selected_features = [
        column
        for column in request.features
        if column in df.columns
    ]

    if len(selected_features) < 2:
        raise ValueError(
            "At least 2 valid feature columns must be selected."
        )


    # -----------------------------------------------------
    # Check target
    # -----------------------------------------------------

    if request.target not in df.columns:

        raise ValueError(
            f"Target column not found: {request.target}"
        )


    # -----------------------------------------------------
    # Prepare X and y
    # -----------------------------------------------------

    X = (
        df[selected_features]
        .apply(pd.to_numeric, errors="coerce")
        .fillna(0)
    )

    y = (
        pd.to_numeric(
            df[request.target],
            errors="coerce"
        )
        .fillna(0)
    )


    # -----------------------------------------------------
    # Train / Test Split
    # -----------------------------------------------------

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )


    # -----------------------------------------------------
    # Create Multiple Linear Regression model
    # -----------------------------------------------------

    model = LinearRegression()


    # -----------------------------------------------------
    # Train model
    # -----------------------------------------------------

    model.fit(
        X_train,
        y_train
    )


    # -----------------------------------------------------
    # Prediction
    # -----------------------------------------------------

    predictions = model.predict(X_test)


    # -----------------------------------------------------
    # Calculate metrics
    # -----------------------------------------------------

    r2 = r2_score(
        y_test,
        predictions
    )

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )


    # -----------------------------------------------------
    # Save model
    # -----------------------------------------------------

    artifact_dir = project_root / "models" / "trained"

    artifact_dir.mkdir(
        parents=True,
        exist_ok=True
    )


    artifact_name = (
        f"{Path(request.dataset_name).stem}"
        f"_multiple_linear_regression.joblib"
    )


    artifact_path = (
        artifact_dir / artifact_name
    )


    joblib.dump(
        model,
        artifact_path
    )


    # -----------------------------------------------------
    # Remove uploaded dataset
    # -----------------------------------------------------

    if dataset_path.exists():
        dataset_path.unlink()


    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return TrainingResponse(

        model="Multiple Linear Regression",

        dataset=request.dataset_name,

        r2_score=float(r2),

        mae=float(mae),

        rmse=float(rmse),

        features=selected_features,

        target=request.target,

        artifact_name=artifact_name
    )