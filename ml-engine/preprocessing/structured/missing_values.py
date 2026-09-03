class MissingValueHandler:
    def handle(self, dataframe):
        return dataframe.fillna(dataframe.mean(numeric_only=True))
