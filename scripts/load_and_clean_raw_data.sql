-- Create raw tables

CREATE TABLE IF NOT EXISTS raw_glassbook (
	`date` DATE,
	campaign_id VARCHAR(255),
	adset_id VARCHAR(255),
	ad_id VARCHAR(255),
	web_tracking TEXT,
	impressions INT(11),
	clicks INT(11),
	spend DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS raw_google_analytics (
	ga_date DATE,
	source VARCHAR(255),
	`medium` VARCHAR(255),
	placement_id INT(11),
	sessions INT(11),
	bounces INT(11)
);

CREATE TABLE IF NOT EXISTS raw_placements (
	placement_id INT(11),
	placement_name VARCHAR(255)
);


-- Load CSV files

LOAD DATA LOCAL INFILE "/var/lib/mysql-files/raw_glassbook.csv"
INTO TABLE raw_glassbook
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE "/var/lib/mysql-files/raw_googleanalytics.csv"
INTO TABLE raw_google_analytics
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE "/var/lib/mysql-files/placements.csv"
INTO TABLE raw_placements
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


-- Create clean tables

CREATE TABLE IF NOT EXISTS glassbook (
	`date` DATE,
	placement_id INT(11),
	impressions INT(11),
	clicks INT(11),
	spend DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS google_analytics (
	`date` DATE,
	placement_id INT(11),
	sessions INT(11),
	bounces INT(11)
);

CREATE TABLE IF NOT EXISTS placements (
	placement_id INT(11),
	funnel VARCHAR(255),
	format VARCHAR(255),
	size VARCHAR(255),
	campaign_name VARCHAR(255)
);

-- Insert data

INSERT INTO glassbook(`date`, placement_id, impressions, clicks, spend)
SELECT
	`date`,
	REPLACE(REGEXP_SUBSTR(web_tracking, ';[0-9]+;'), ";", "") AS placement_id,
	impressions,
	clicks,
	spend
FROM raw_glassbook;

INSERT INTO google_analytics(`date`, placement_id, sessions, bounces)
SELECT 
	ga_date AS `date`,
	placement_id,
	sessions,
	bounces
FROM raw_google_analytics;

INSERT INTO placements(placement_id, funnel, format, size, campaign_name)
SELECT 
	placement_id,
	SUBSTRING_INDEX(placement_name, "_", 1) AS funnel,
	SUBSTRING_INDEX(SUBSTRING_INDEX(placement_name, "_", 2), "_", -1) AS format,
	SUBSTRING_INDEX(SUBSTRING_INDEX(placement_name, "_", 3), "_", -1) AS size,
	SUBSTRING_INDEX(placement_name, "_", -1) AS campaign_name
FROM raw_placements;


-- Drop raw tables

DROP TABLE IF EXISTS raw_glassbook;
DROP TABLE IF EXISTS raw_google_analytics;
DROP TABLE IF EXISTS raw_placements;

