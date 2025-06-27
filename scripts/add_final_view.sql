CREATE VIEW campaign_stats AS
SELECT 
	g.placement_id,
	g.date,
	p.funnel,
	p.format,
	p.size,
	p.campaign_name,
	g.impressions,
	g.clicks,
	g.spend,
	ga.sessions,
	ga.bounces
FROM glassbook g
JOIN google_analytics ga ON (g.placement_id = ga.placement_id AND g.date = ga.date)
JOIN placements p ON g.placement_id = p.placement_id;