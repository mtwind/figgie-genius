# backend/main.py
from fastapi import FastAPI
import models
import database

# This line tells SQLAlchemy to create all tables based on the models
# It checks if the tables exist before creating them.
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Figgie Backend is running!"}

@app.get("/api/status")
def get_status():
    return {"status": "ok"}