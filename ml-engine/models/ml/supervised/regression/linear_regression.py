class LinearRegressionModel:
    def __init__(self):
        self.model = None

    def fit(self, X, y):
        from sklearn.linear_model import LinearRegression
        self.model = LinearRegression()
        return self.model.fit(X, y)

    def predict(self, X):
        return self.model.predict(X)
