from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="Glassroom Campaign API")
app.include_router(router)