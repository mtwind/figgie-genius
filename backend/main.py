# backend/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Figgie Backend is running!"}

@app.get("/api/status")
def get_status():
    return {"status": "ok"}