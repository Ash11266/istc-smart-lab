from fastapi import FastAPI, UploadFile, File
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from sklearn.ensemble import IsolationForest

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    # Only numeric data
    df_numeric = df.select_dtypes(include=['number'])

    if df_numeric.empty:
        return {"result": "No numeric data found", "accuracy": "0%"}

    model = IsolationForest(contamination=0.1)
    model.fit(df_numeric)

    preds = model.predict(df_numeric)

    anomalies = list(preds).count(-1)
    total = len(preds)

    result = "Anomaly Detected 🚨" if anomalies > 0 else "Normal ✅"
    accuracy = f"{round((1 - anomalies/total)*100, 2)}%"

    return {
        "result": result,
        "accuracy": accuracy,
        "total_rows": total,
        "anomalies": anomalies
    }