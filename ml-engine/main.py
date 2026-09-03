from fastapi import FastAPI

from api.mlapi.regressionapi.linear_regression_api import router as linear_regression_router
from api.mlapi.regressionapi.multiple_linear_regression_api import router as multiple_linear_regression_router


app = FastAPI(title='AI Model Platform ML Engine')
app.include_router(linear_regression_router)
app.include_router(multiple_linear_regression_router)
@app.get('/health')
def health():
    return {'status': 'ok'}
