class MultipleLinearRegressionModel:
    def __init__(self):
        self.model = None

    def fit(self, X, y):
        from sklearn.linear_model import MultipleLinearRegression
        self.model = MultipleLinearRegression()
        return self.model.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)