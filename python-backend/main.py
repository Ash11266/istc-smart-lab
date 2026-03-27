from fastapi import FastAPI
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI()

@app.get("/ml-analytics")
def ml_analytics():
    try:
        df = pd.read_csv("data.csv")
    except:
        return {"status": "no_data"}

    if df.empty:
        return {"status": "no_data"}

    X = np.arange(len(df)).reshape(-1,1)
    y = df["temperature"]

    model = LinearRegression()
    model.fit(X, y)

    pred = model.predict([[len(df)+1]])

    return {
        "status": "ok",
        "prediction": float(pred[0])
    }