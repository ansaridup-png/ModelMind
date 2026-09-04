from fastapi import FastAPI

from api.mlapi.regressionapi.linear_regression_api import router as linear_regression_router
from api.mlapi.regressionapi.multiple_linear_regression_api import router as multiple_linear_regression_router
from api.mlapi.regressionapi.polynomial_regression_api import router as polynomial_regression_router
from api.mlapi.regressionapi.ridge_regression_api import router as ridge_regression_router
from api.mlapi.regressionapi.decision_tree_api import router as decision_tree_router
from api.mlapi.regressionapi.random_forest_api import router as random_forest_router

app = FastAPI(title='AI Model Platform ML Engine')
app.include_router(linear_regression_router)
app.include_router(multiple_linear_regression_router)
app.include_router(polynomial_regression_router)
app.include_router(ridge_regression_router)
app.include_router(decision_tree_router)
app.include_router(random_forest_router)
@app.get('/health')
def health():
    return {'status': 'ok'}
