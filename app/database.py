from dotenv import load_dotenv
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

def get_campaign_stats():
  conn = create_engine(db_url_object)
  df = pd.read_sql("SELECT * FROM campaign_stats", conn)
  df.to_csv("data/campaign_stats.csv", index=False)
  conn.dispose()
  return df.to_dict(orient="records")