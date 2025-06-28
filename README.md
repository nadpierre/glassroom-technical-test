# Glassroom Technical Assignment

This project is a full-stack data processing and visualization app built as part of the technical assessment.  
It includes a FastAPI backend, an Angular frontend, and MySQL transformations based on input CSV files.

The goal was to:

- Transform and structure raw media and analytics data from multiple CSV sources
- Build a database with a clean dimensional model using SQL
- Expose the data via a FastAPI backend
- Build a user-friendly Angular frontend to explore and filter the final dataset

## Setup the Database

1. Create a MySQL database

   ```bash
   mysql> CREATE DATABASE IF NOT EXISTS [db_name];
   mysql> USE [db_name];
   ```

2. Create a new user and grant all privileges

   ```bash
   mysql> CREATE USER [db_user]@[db_host];
   mysql> GRANT ALL PRIVILEGES ON [db_name].* TO [db_user]@[db_host] IDENTIFIED BY [db_pwd];
   ```

3. Copy the file `.env-sample` and rename it `.env`.

4. Replace the following variables with your actual credentials

   ```
   MYSQL_USERNAME="[db_user]"
   MYSQL_PASSWORD="[db_pwd]"
   MYSQL_HOST="[db_host]"
   MYSQL_DB="[db_name]"
   ```

5. In the `backend/scripts/load_and_clean_raw_data.sql` file, replace the paths with the absolute paths of the raw files in the `backend/data/raw/` folder: `placements.csv`, `raw_glassbook.csv` and `raw_googleanalytics.csv`.

6. Run the script to load and clean the raw data:

   ```bash
   mysql> USE [db_name];
   mysql> SOURCE backend/scripts/load_and_clean_raw_data.sql;
   ```

   The script load the raw CSV files, cleans the data and create 3 tables with the relevant columns.

7. Run the script to merge the data
   ```bash
   mysql> USE [db_name];
   mysql> SOURCE backend/scripts/add_stats_view.sql;
   ```
   The script creates a view that merges the the 3 tables.

## Run the Backend

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate # or venv\\Scripts\\activate on Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Launch the FastAPI server:

   ```bash
   uvicorn app.main:app --reload
   ```

- Open the browser to `http://localhost:8000`
- The API documentation will be available at `http://localhost:8000/docs`

## Run The Frontend

1. Navigate to the frontend folder:

   ```bash
   cd frontend-glassroom
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Lauch the Angular App:
   ```bash
   ng serve
   ```
   Open the browser to `http://localhost:4200`.
