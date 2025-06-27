from fastapi import APIRouter
from app.database import get_campaign_stats

router = APIRouter()

@router.get("/stats")
def get_stats():
  return get_campaign_stats()