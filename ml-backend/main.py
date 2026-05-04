from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI()

# Allow CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if Next.js runs on a different port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read the uploaded CSV file
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Here you would typically run your actual ML model.
        # For example: model.predict(df)
        
        # For now, we simulate a prediction based on the data length
        row_count = len(df)
        
        if row_count > 0:
            result = "System Stable (Normal Operation)"
            accuracy = "98.5%"
        else:
            result = "Insufficient Data"
            accuracy = "0%"

        return {
            "result": result,
            "accuracy": accuracy,
            "details": f"Processed {row_count} rows of telemetry data."
        }
        
    except Exception as e:
        return {"error": str(e), "result": "Failed to process CSV", "accuracy": "N/A"}

# To run this server:
# 1. pip install fastapi uvicorn pandas python-multipart
# 2. uvicorn main:app --reload --port 8000
