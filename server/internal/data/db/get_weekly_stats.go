package db

import (
	"database/sql"
	"fmt"

	sq "github.com/Masterminds/squirrel"

	_ "github.com/heroku/x/hmetrics/onload"
	"github.com/philLITERALLY/wodland-service/internal/data"
)

// GetWeeklyStats will get and return weekly stats for a logged in user
func GetWeeklyStats(db *sql.DB, userID int) ([]data.WeekStats, error) {
	var dbWeeklyStats []data.WeekStats

	statsQuery := psql.
		Select("date_part('year', (to_timestamp(cast(date as int))::date)::date) as year, date_part('week', (to_timestamp(cast(date as int))::date)::date) AS week, COUNT(*) as WODs, SUM(time_taken) as totalTime, SUM(meps) as MEPs").
		From("activity").
		Where(sq.Eq{"user_id": userID}).
		GroupBy("year, week").
		OrderBy("year, week")
	sqlStatsQuery, args, _ := statsQuery.ToSql()

	fmt.Printf("\n sqlStatsQuery: %v", sqlStatsQuery)
	fmt.Printf("\n args: %v", args)

	rows, err := db.Query(sqlStatsQuery, args...)
	if err != nil {
		return dbWeeklyStats, err
	}

	defer rows.Close()
	for rows.Next() {
		var weekStats data.WeekStats

		if err := rows.Scan(&weekStats.Year, &weekStats.Week, &weekStats.WODs, &weekStats.TimeTaken, &weekStats.MEPs); err != nil {
			return dbWeeklyStats, err
		}

		dbWeeklyStats = append(dbWeeklyStats, weekStats)
	}

	return dbWeeklyStats, nil
}