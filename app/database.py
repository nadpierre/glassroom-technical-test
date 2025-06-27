from dotenv import load_dotenv
import io
import os
import pandas as pd
from sqlalchemy import create_engine, URL

load_dotenv()
driver = os.getenv("MYSQL_DRIVER")
username = os.getenv("MYSQL_USERNAME")
password = os.getenv("MYSQL_PASSWORD")
host = os.getenv("MYSQL_HOST")
database = os.getenv("MYSQL_DB")

db_url_object = URL.create(
  drivername=driver, 
  username=username,
  password=password,
  host=host,
  database=database
)

def get_campaign_stats() -> dict:
  conn = create_engine(db_url_object)
  df = pd.read_sql("SELECT * FROM campaign_stats", conn)
  df.to_csv("data/campaign_stats.csv", index=False)
  conn.dispose()
  return df.to_dict(orient="records")

async def process_uploaded_files(files) -> list:
  conn = create_engine(db_url_object)
  result = []

  for file in files:
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    if "web_tracking" in df.columns: # raw_glassbook
      df = preprocess_glassbook(df)
      df.to_sql(name="glassbook", con=conn, if_exists="append", index=False)
      result.append("Glassbook data processed")
    elif "bounces" in df.columns: # google_analytics
      df = preprocess_analytics(df)
      df.to_sql(name="google_analytics", con=conn, if_exists="append", index=False)
      result.append("Analytics data processed")
    elif "placement_name" in df.columns: # placements
      df = preprocess_placements(df)
      df.to_sql(name="placements", con=conn, if_exists="append", index=False)
      result.append("Placements data processed")
    else:
      result.append(f"Unknown structure in file: {file.filename}")

  conn.dispose()
  return result

def get_filtered_campaigns(name:str) -> dict:
  conn = create_engine(db_url_object)
  df = pd.read_sql(
    sql="SELECT * FROM campaign_stats WHERE campaign_name = %(name)s",
    con=conn,
    params={"name": name}
  )
  conn.dispose()
  return df.to_dict(orient="records")

def preprocess_glassbook(df: pd.DataFrame) -> pd.DataFrame:
  df["placement_id"] = df["web_tracking"].str.extract(r"(?<=;)(\d+)(?=;[a-z])")
  return df[["date", "placement_id", "impressions", "clicks", "spend"]]

def preprocess_analytics(df: pd.DataFrame) -> pd.DataFrame:
  df["date"] = df["ga_date"]
  return df[["date", "placement_id", "sessions", "bounces"]]

def preprocess_placements(df: pd.DataFrame) -> pd.DataFrame:
  parts = df["placement_name"].str.split("_", expand=True)
  df["funnel"] = parts[0]
  df["format"] = parts[1]
  df["size"] = parts[2]
  df["campaign_name"] = parts[3]
  return df[["placement_id", "funnel", "format", "size", "campaign_name"]]