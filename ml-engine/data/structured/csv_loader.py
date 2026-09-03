import pandas as pd


class CsvLoader:
    def load(self, path):
        return pd.read_csv(path)
