from fastapi import APIRouter, UploadFile, File
from typing import List
from app.database import *

router = APIRouter()

@router.get("/stats")
def get_stats():
  return get_campaign_stats()

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
  result = await process_uploaded_files(files)
  return {"status": "success", "details": result}

@router.get("/campaigns")
def get_campaigns(name:str):
  return get_filtered_campaigns(name)