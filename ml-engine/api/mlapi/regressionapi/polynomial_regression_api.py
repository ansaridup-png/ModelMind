from pathlib import Path

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
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures


router = APIRouter(prefix="/api")


# =========================================================
# Request
# =========================================================

class TrainingRequest(BaseModel):
    model_name: str
    dataset_name: str
    target: str
    features: list[str]
    degree: int = 2


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
    degree: int
    artifact_name: str


# =========================================================
# Polynomial Regression
# =========================================================

@router.post("/train/polynomial-regression")
def train_polynomial_regression(
    request: TrainingRequest
):

    # -----------------------------------------------------
    # Validate degree
    # -----------------------------------------------------

    if request.degree < 2:
        raise ValueError(
            "Polynomial Regression degree must be at least 2."
        )


    # -----------------------------------------------------
    # Find uploaded dataset
    # -----------------------------------------------------

    project_root = Path(__file__).resolve().parents[3]

    dataset_path = (
        project_root
        / "data"
        / "uploaded"
        / request.dataset_name
    )

    if not dataset_path.exists():

        uploaded_dir = (
            project_root
            / "data"
            / "uploaded"
        )

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
            "At least 1 feature column is required "
            "for Polynomial Regression."
        )


    # -----------------------------------------------------
    # Check feature columns
    # -----------------------------------------------------

    selected_features = [
        column
        for column in request.features
        if column in df.columns
    ]

    if not selected_features:

        raise ValueError(
            "At least 1 valid feature column must be selected."
        )


    # -----------------------------------------------------
    # Check target
    # -----------------------------------------------------

    if request.target not in df.columns:

        raise ValueError(
            f"Target column not found: {request.target}"
        )


    # -----------------------------------------------------
    # Make sure target is not a feature
    # -----------------------------------------------------

    if request.target in selected_features:

        raise ValueError(
            "Target column cannot also be selected as a feature."
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
    # Create Polynomial Regression model
    # -----------------------------------------------------

    model = make_pipeline(

        PolynomialFeatures(
            degree=request.degree,
            include_bias=False
        ),

        LinearRegression()
    )


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

    predictions = model.predict(
        X_test
    )


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

    artifact_dir = (
        project_root
        / "models"
        / "trained"
    )

    artifact_dir.mkdir(
        parents=True,
        exist_ok=True
    )


    artifact_name = (
        f"{Path(request.dataset_name).stem}"
        f"_polynomial_regression.joblib"
    )


    artifact_path = (
        artifact_dir
        / artifact_name
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

        model="Polynomial Regression",

        dataset=request.dataset_name,

        r2_score=float(r2),

        mae=float(mae),

        rmse=float(rmse),

        features=selected_features,

        target=request.target,

        degree=request.degree,

        artifact_name=artifact_name
    )