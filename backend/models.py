# backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    pot_value = Column(Float, nullable=True)
    # We can add more fields later, like winner_id, goal_suit, etc.